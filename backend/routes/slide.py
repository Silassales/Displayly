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
				f = open("~/imgs/" + image['name'] , "wb+"):
				f.write(base64.decodebytes(image['data']))
				f.close()

				# sql3 = "INSERT INTO ImagesToSlides (ImagePath, SlideId) VALUES (%s, %s)"

				# try:
				# 	cursor.execute(sql3, ("TODO", slideId,))
				# 	db.commit()

				# 	res.body = '{"success": true, "slideId": ' + slideId + '}'
				# 	res.status = falcon.HTTP_200

				# except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				# 	res.body = '{' + '"error":"{}"'.format(e) + '}'
				# 	res.status = falcon.HTTP_400
				# 	db.close()
				# 	return

			res.body = '{"success": true, "slideId": ' + slideId + '}'
			res.status = falcon.HTTP_200

			db.close()