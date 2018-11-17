import falcon
import json
import jwt
import mysql.connector

class WorkspaceRoutes(object):
	def getBodyFromRequest(self, req):
		raw_json = req.bounded_stream.read()
		data = raw_json.decode('utf8') #.replace("'", "\\'")
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

	def on_post(self, req, res):
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
				res.body = '{"error":"Workspace name required."}'
				res.status = falcon.HTTP_400
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "INSERT INTO Workspaces (Name, AdminId) VALUES (%s, %s)"
			sql2 = "SELECT MAX(WorkspaceId) FROM Workspaces"
			sql3 = "INSERT INTO UsersToWorkspaces (UserId, WorkspaceId) VALUES (%s, %s)"

			try:
				cursor.execute(sql, (body['name'], tokenContents['userId'], ))
				db.commit()
				cursor.execute(sql2)
				data = cursor.fetchone()
				cursor.execute(sql3, (tokenContents['userId'], data[0]))
				db.commit()

				res.body = '{"success": true, "workspaceId": ' + str(data[0]) + '}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

		db.close()

	def on_get(self, req, res):
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
			cursor = db.cursor()

			sql = """SELECT Workspaces.WorkspaceId, Workspaces.Name, 
				CASE WHEN Workspaces.AdminId = %s THEN 1 ELSE 0 END AS IsAdmin 
				FROM Workspaces 
				INNER JOIN UsersToWorkspaces 
				ON Workspaces.WorkspaceId = UsersToWorkspaces.WorkspaceId 
				WHERE UsersToWorkspaces.UserId = %s"""

			try:
				cursor.execute(sql, (tokenContents['userId'], tokenContents['userId'],))
				data = cursor.fetchall()

				json = '{"success": true, "workspaces": ['

				for workspaceId, workspaceName, isAdmin in data:
					formattedWorkspaceName = workspaceName.replace('"', '\\"')
					json += ('{"id": ' + str(workspaceId) + ', "name": "' + formattedWorkspaceName + '", "isAdmin": ' + self.intToBoolString(isAdmin) + ' },')

				if len(data) > 0:
					json = json[:-1]

				res.status = falcon.HTTP_200
				res.body = json + ']}'

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()
	
	def on_delete(self, req, res, workspaceId):
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
			sql = "DELETE FROM Workspaces WHERE WorkspaceId = %s"
			sql2 = "DELETE FROM UsersToWorkspaces WHERE WorkspaceId = %s"

			try:
				cursor.execute(sql, (workspaceId,))
				db.commit()

				cursor.execute(sql2, (workspaceId,))
				db.commit()

				res.body = '{"success": true}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400