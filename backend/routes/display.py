import falcon
import json
import jwt
import mysql.connector

class DisplayRoutes(object):
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

	def intToBoolString(self, number):
		if number == 1:
			return "true"
		else:
			return "false"

	def valueToString(self, value):
		if value == None:
			return 'null'
		return str(value)

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

			if body == None or 'name' not in body:
				res.body = '{"error":"Display name required."}'
				res.status = falcon.HTTP_400
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], workspaceId):
				res.body = '{"error":"This user does not have permissions to add displays to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()
			sql = "INSERT INTO Displays (Name, WorkspaceId) VALUES (%s, %s)"
			sql2 = "SELECT MAX(DisplayId) FROM Displays"

			try:
				cursor.execute(sql, (body['name'], workspaceId, ))
				db.commit()
				cursor.execute(sql2)
				data = cursor.fetchone()

				res.body = '{"success": true, "displayId": ' + str(data[0]) + '}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

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
				res.body = '{"error":"This user does not have permissions to view displays that belong to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()

			sql = """SELECT DisplayId, Name, SceneId
				FROM Displays
				WHERE Displays.WorkspaceId = %s"""

			try:
				cursor.execute(sql, (workspaceId,))
				data = cursor.fetchall()

				json = '{"success": true, "displays": ['

				for displayId, displayName, sceneId in data:
					json += ('{"id": ' + str(displayId) + ', "name": "' + displayName + '", "sceneId": ' + self.valueToString(sceneId) + '},')

				if len(data) > 0:
					json = json[:-1]

				res.status = falcon.HTTP_200
				res.body = json + ']}'

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()

	def on_put_withDisplayId(self, req, res, workspaceId, displayId):
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
				res.body = '{"error":"This user does not have permissions to view displays that belong to this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			body = self.getBodyFromRequest(req)

			if body == None or 'sceneId' not in body:
				res.body = '{"error":"\'sceneId\' field required (value can be null)."}'
				res.status = falcon.HTTP_400
				return

			cursor = db.cursor()
			sql = "UPDATE Displays SET SceneId = %s WHERE DisplayId = %s AND WorkspaceId = %s"

			try:
				cursor.execute(sql, (body['sceneId'], displayId, workspaceId, ))
				db.commit()

				res.body = '{"success": true}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()

	def on_get_withDisplayId(self, req, res, workspaceId, displayId):
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
				res.body = '{"error":"This user does not have permissions to view displays in this workspace."}'
				res.status = falcon.HTTP_401
				db.close()
				return

			cursor = db.cursor()
			sql = """SELECT DisplayId, Name, SceneId
					FROM Displays
					WHERE Displays.WorkspaceId = %s
					AND Displays.DisplayId = %s"""

			try:
				cursor.execute(sql, (workspaceId, displayId,))
				data = cursor.fetchone()

				if len(data) == 0:
					res.body = '{"error": "No display found"}' 
					res.status = falcon.HTTP_400
				else:
					json = '{"success": true, "display": {"id": ' + str(data[0]) + ', "name": "' + data[1] + '", "sceneId": ' + self.valueToString(data[2]) + '}'

					res.body = json + '}'
					res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400
			db.close()

	def on_delete_withDisplayId(self, req, res, workspaceId, displayId):
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
			sql = "DELETE FROM Displays WHERE DisplayId = %s"

			try:
				cursor.execute(sql, (displayId,))
				db.commit()

				res.body = '{"success": true}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400
