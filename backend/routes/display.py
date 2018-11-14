import falcon
import json
import jwt
import mysql.connector

class DisplayRoutes(object):
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

	def intToBoolString(self, number):
		if number == 1:
			return "true"
		else:
			return "false"

	def authroizedWorkspace(self, db, userId, workspaceId):
		cursor = db.cursor()
		sql = "SELECT WorkspaceId FROM UsersToWorkspaces WHERE UserId = %s"

		try:
			cursor.execute(sql, (userId,))
			data = cursor.fetchall()

			for workspaceIdentifier in data:
				if workspaceId == workspaceIdentifier:
					return True

			return False

		except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
			return False

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

			if body == None or 'name' not in body or "workspaceId" not in body:
				res.body = '{"error":"Display name and Workspace ID required."}'
				res.status = falcon.HTTP_400
				return

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

			if not self.authroizedWorkspace(db, tokenContents['userId'], body['workspaceId']):
				res.body = '{"error":"This user does not have permissions to add displays to this workspace."}'
				res.status = falcon.HTTP_401
				return

			cursor = db.cursor()
			sql = "INSERT INTO Displays (Name, WorkspaceId) VALUES (%s, %s)"
			sql2 = "SELECT MAX(DisplayId) FROM Displays"

			try:
				cursor.execute(sql, (body['name'], body['workspaceId'], ))
				db.commit()
				cursor.execute(sql2)
				data = cursor.fetchone()

				res.body = '{"success": true, "displayId": ' + str(data[0]) + '}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()