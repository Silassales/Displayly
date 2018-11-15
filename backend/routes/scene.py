import falcon
import jwt

class SceneRoutes(object):
	def getBodyFromRequest(self, req):
		raw_json = req.bounded_stream.read()
		data = raw_json.decode('utf8').replace("'", '"')
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

			if body == None or 'name' not in body or 'workspaceId' not in body:
				res.body = '{"error":"Scene name and Workspace ID required."}'
				res.status = falcon.HTTP_400

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "INSERT INTO Scenes (Name, WorkspaceId) VALUES (%s)"
			sql2 = "SELECT MAX(SceneId) FROM Scenes"

			try:
				cursor.execute(sql, (body['name'], body['workspaceId'], ))
				db.commit()
				cursor.execute(sql2)
				data = cursor.fetchone()

				res.body = '{"success": true, "sceneId": ' + str(data[0]) + '}'
				res.status = falcon.HTTP_200

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()