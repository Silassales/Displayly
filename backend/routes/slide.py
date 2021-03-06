import falcon
import jwt
import json
import base64
import mysql.connector

class SlideRoutes(object):
	def getBodyFromRequest(self, req):
		raw_json = req.bounded_stream.read()
		data = raw_json.decode('utf8').replace("'", '\\"')
		if len(data) == 0:
			return None
		return json.loads(data)

	def decodeToken(self, token, expectedResetToken = False):
		try:
			options = {'verify_exp': True}
			decodedToken = jwt.decode(token, 'secret', verify='True', algorithms=['HS256'], options=options)

			if expectedResetToken == False or decodedToken["validForPasswordReset"] == None:
				return decodedToken
			return None
		except (jwt.DecodeError, jwt.ExpiredSignatureError) as err:
			return None

	def authroizedWorkspace(self, db, userId, workspaceId):
		cursor = db.cursor()
		sql = "SELECT WorkspaceId FROM UsersToWorkspaces WHERE UserId = %s"

		try:
			cursor.execute(sql, (userId,))
			data = cursor.fetchall()

			for workspaceIdentifier in data:
				if int(workspaceId) == int(workspaceIdentifier[0]):
					return True

			return False

		except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
			return False

	def scenesUsingSlide(self, slideId, db):
		sql = """SELECT Scenes.Name FROM Scenes 
				INNER JOIN SlidesToScenes 
				ON Scenes.SceneId = SlidesToScenes.SceneId 
				WHERE SlidesToScenes.SlideId = %s"""

		cursor = db.cursor()

		try:
			cursor.execute(sql, (slideId, ))
			data = cursor.fetchall()

			json = '{"error": "This slide can not be deleted. Check that no scenes are using this slide, then try deleting again.", "scenes": ['

			for sceneName in data:
				json += '"' + str(sceneName[0]) + '",'

			if len(data) > 0:
				json = json[:-1]

			return json + ']}'

		except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
			return '{"error":"This slide can not be deleted. Check that no scenes are using this slide, then try deleting again."}'

	def on_post(self, req, res, workspaceId):
		if req.auth == None:
			res.status = falcon.HTTP_401
			res.body = '{"error":"Authorization token required"}'
		else:
			tokenContents = self.decodeToken(req.auth)

			if tokenContents == None:
				res.status = falcon.HTTP_401
				res.body = '{"error":"Invalid token"}'
				return

			body = self.getBodyFromRequest(req)

			if body == None or 'name' not in body or 'layoutId' not in body or 'images' not in body:
				res.body = '{"error":"Slide name, Layout Id and images are required."}'
				res.status = falcon.HTTP_400
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], workspaceId):
				res.body = '{"error":"This user does not have permissions to add scenes to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()
			sql = "INSERT INTO Slides (Name, WorkspaceId, LayoutId) VALUES (%s, %s, %s)"
			sql2 = "SELECT MAX(SlideId) FROM Slides"

			slideId = "0"

			try:
				cursor.execute(sql, (body['name'], workspaceId, body['layoutId'],))
				db.commit()
				cursor.execute(sql2)
				data = cursor.fetchone()

				slideId = str(data[0])

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400
				db.close()
				return

			for image in body['images']:
				imageData = base64.b64decode(image['data'])
				with open("/var/images/" + workspaceId + "_" + image['name'], "wb+") as f:
					f.write(imageData)

				sql3 = "INSERT INTO ImagesToSlides (ImagePath, SlideId) VALUES (%s, %s)"

				try:
					cursor.execute(sql3, (workspaceId + "_" + image['name'], slideId,))
					db.commit()

					res.body = '{"success": true, "slideId": ' + slideId + '}'
					res.status = falcon.HTTP_200

				except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
					res.body = '{' + '"error":"{}"'.format(e) + '}'
					res.status = falcon.HTTP_400
					db.close()
					return

			res.body = '{"success": true, "slideId": ' + slideId + '}'
			res.status = falcon.HTTP_200

			db.close()

	def on_get(self, req, res, workspaceId):
		if req.auth == None:
			res.status = falcon.HTTP_401
			res.body = '{"error":"Authorization token required"}'
		else:
			tokenContents = self.decodeToken(req.auth)

			if tokenContents == None:
				res.status = falcon.HTTP_401
				res.body = '{"error":"Invalid token"}'
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], workspaceId):
				res.body = '{"error":"This user does not have permissions to view slides that belong to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()

			sql = """SELECT SlideId, Name, LayoutId
				FROM Slides
				WHERE WorkspaceId = %s"""

			try:
				cursor.execute(sql, (workspaceId,))
				data = cursor.fetchall()

				json = '{"success": true, "slides": ['

				for slideId, slideName, layoutId in data:
					json += ('{"id": ' + str(slideId) + ', "name": "' + slideName + '", "layoutId": ' + str(layoutId) + '},')

				if len(data) > 0:
					json = json[:-1]

				res.status = falcon.HTTP_200
				res.body = json + ']}'

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()

	def on_get_withSlideId(self, req, res, workspaceId, slideId):
		if req.auth == None:
			res.status = falcon.HTTP_401
			res.body = '{"error":"Authorization token required"}'
		else:
			tokenContents = self.decodeToken(req.auth)

			if tokenContents == None:
				res.status = falcon.HTTP_401
				res.body = '{"error":"Invalid token"}'
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], workspaceId):
				res.body = '{"error":"This user does not have permissions to view slides that belong to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()

			sql = """SELECT ImagesToSlides.ImagePath, Slides.LayoutId
				FROM ImagesToSlides
				INNER JOIN Slides
				ON Slides.SlideId = ImagesToSlides.SlideId
				WHERE ImagesToSlides.SlideId = %s"""

			try:
				cursor.execute(sql, (slideId,))
				data = cursor.fetchall()
				json = ""

				if len(data) > 0:
					json = '{"success": true, "layoutId": ' + str(data[0][1]) + ', "images": ['

					for imageName in data:
						json += ('"/imgs/' + str(imageName[0]) + '",')

					json = json[:-1] + "]}"
					res.status = falcon.HTTP_200
				else:
					json = '{"error":"No images on slide"}'
					res.status = falcon.HTTP_400
				res.body = json

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()

	def on_delete_withSlideId(self, req, res, workspaceId, slideId):
		if req.auth == None:
			res.status = falcon.HTTP_401
			res.body = '{"error":"Authorization token required"}'
		else:
			tokenContents = self.decodeToken(req.auth)

			if tokenContents == None:
				res.status = falcon.HTTP_401
				res.body = '{"error":"Invalid token"}'
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], workspaceId):
				res.body = '{"error":"This user does not have permissions to make modifications in this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()
			sql = "DELETE FROM Slides WHERE SlideId = %s"
			sql2 = "DELETE FROM SlidesToScenes WHERE SlideId = %s"

			try:
				cursor.execute(sql, (slideId,))
				db.commit()

				cursor.execute(sql2, (slideId,))
				db.commit()

				res.body = '{"success": true}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = self.scenesUsingSlide(slideId, db)
				res.status = falcon.HTTP_400

			db.close()
