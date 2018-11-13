import falcon
import json
import jwt
import bcrypt
import mysql.connector
from datetime import datetime, timedelta

class WorkspaceRoutes(object):
	def getBodyFromRequest(self, req):
		raw_json = req.bounded_stream.read()
		data = raw_json.decode('utf8').replace("'", '"')
		if len(data) == 0:
			return None
		return json.loads(data)

	def decodeToken(self, token):
		try:
			options = {'verify_exp': True}
			return jwt.decode(token, 'secret', verify='True', algorithms=['HS256'], options=options)
		except (jwt.DecodeError, jwt.ExpiredSignatureError) as err:
			return None

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

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "INSERT INTO Workspaces (Name, AdminId) VALUES (%s, %s)"
			sql2 = "SELECT WorkspaceId FROM Workspaces where Name = %s"
			sql3 = "INSERT INTO UsersToWorkspaces (UserId, WorkspaceId) VALUES (%s, %s)"

			try:
				cursor.execute(sql, (body['name'], tokenContents['userId'], ))
				cursor.execute(sql2, (body['name'], ))
				data = cursor.fetchone()
				cursor.execute(sql3, (tokenContents['userId'], data[0]))

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
			sql = """SELECT Workspaces.WorkspaceId, Workspaces.Name
				FROM Workspaces
				INNER JOIN UsersToWorkspaces
				ON Workspaces.WorkspaceId = UsersToWorkspaces.WorkspaceId
				WHERE UsersToWorkspaces.UserId = %s"""

			try:
				cursor.execute(sql, (tokenContents['userId'],))
				data = cursor.fetchall()

				json = '{"success": true, "workspaces": ['

				for workspaceId, workspaceName in data:
					json += ('{"id": ' + str(workspaceId) + ', "name": "' + workspaceName + '" },')

				if len(data) > 0:
					json = json[:-1]

				res.status = falcon.HTTP_200
				res.body = json + ']}'

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401

			db.close()
