import falcon
import jwt
import json
import mysql.connector

class SceneRoutes(object):
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

	def displaysUsingScene(self, sceneId, db):
		sql = """SELECT Displays.Name FROM Displays 
				INNER JOIN Slides
				ON Displays.SceneId = Scenes.SceneId 
				WHERE Scenes.SlideId = %s"""

		cursor = db.cursor()

		try:
			cursor.execute(sql, (sceneId, ))
			data = cursor.fetchall()

			json = '{"error": "This scene can not be deleted. Check that no displays are using this scene, then try deleting again.", "displays": ['

			for displayName in data:
				json += '"' + str(displayName[0]) + '",'

			if len(data) > 0:
				json = json[:-1]

			return json + ']}'

		except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
			return '{"error":"This scene can not be deleted. Check that no displays are using this scene, then try deleting again."}'

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

			if body == None or 'name' not in body:
				res.body = '{"error":"Scene name required."}'
				res.status = falcon.HTTP_400
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], workspaceId):
				res.body = '{"error":"This user does not have permissions to add scenes to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()
			sql = "INSERT INTO Scenes (Name, WorkspaceId) VALUES (%s, %s)"
			sql2 = "SELECT MAX(SceneId) FROM Scenes"

			try:
				cursor.execute(sql, (body['name'], workspaceId, ))
				db.commit()
				cursor.execute(sql2)
				data = cursor.fetchone()

				res.body = '{"success": true, "sceneId": ' + str(data[0]) + '}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()

	def on_put_withSceneId(self, req, res, workspaceId, sceneId):
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

			if body == None or 'slides' not in body:
				res.body = '{"error":"Slide ID\'s required."}'
				res.status = falcon.HTTP_400
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], workspaceId):
				res.body = '{"error":"This user does not have permissions to make modifications in this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()
			sql = "DELETE FROM SlidesToScenes WHERE SceneId = %s"
			sql2 = "INSERT INTO SlidesToScenes (SlideId, SceneId) VALUES (%s, %s)"

			try:
				cursor.execute(sql, (sceneId,))
				db.commit()

				for slideId in body['slides']:
					cursor.execute(sql2, (slideId, sceneId,))
					db.commit()

				res.body = '{"success": true}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

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
				res.body = '{"error":"This user does not have permissions to view scenes that belong to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()

			sql = """SELECT SceneId, Name
				FROM Scenes
				WHERE WorkspaceId = %s"""

			try:
				cursor.execute(sql, (workspaceId,))
				data = cursor.fetchall()

				json = '{"success": true, "scenes": ['

				for sceneId, sceneName in data:
					sql2 = """SELECT SlideId
						FROM SlidesToScenes
						WHERE SceneId = %s """

					cursor.execute(sql2, (sceneId,))
					data2 = cursor.fetchall()

					json += '{"id": ' + str(sceneId) + ', "name": "' + sceneName + '", "slides": ['

					for slideId in data2:
						json += str(slideId[0]) + ', '

					if len(data2) > 0:
						json = json[:-2] + ']},'
					else:
						json += ']},'

				res.status = falcon.HTTP_200

				if len(data) > 0:
					res.body = json[:-1] + ']}'
				else:
					res.body = json + ']}'

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()

	def on_get_withSceneId(self, req, res, workspaceId, sceneId):
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
			sql = """SELECT SlidesToScenes.SlideId
					FROM SlidesToScenes
					INNER JOIN Scenes
					ON Scenes.WorkspaceId = %s
					WHERE SlidesToScenes.SceneId = %s """

			try:
				cursor.execute(sql, (workspaceId, sceneId,))
				data = cursor.fetchall()

				json = '{"success": true, "slides": ['

				for slideId in data:
					json += str(slideId[0]) + ","

				if len(data) > 0:
					json = json[:-1]

				res.body = json + "]}"
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

	def on_delete_withSceneId(self, req, res, workspaceId, sceneId):
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
			sql = "DELETE FROM Scenes WHERE SceneId = %s"
			sql2 = "DELETE FROM SlidesToScenes WHERE SceneId = %s"

			try:
				cursor.execute(sql, (sceneId,))
				db.commit()

				cursor.execute(sql2, (sceneId,))
				db.commit()

				res.body = '{"success": true}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = self.displaysUsingScene(sceneId, db)
				res.status = falcon.HTTP_400
