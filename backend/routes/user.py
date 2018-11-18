import falcon
import json
import jwt
import bcrypt
import mysql.connector
from datetime import datetime, timedelta

class UserRoutes(object):
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

	def authroizedWorkspace(self, db, userId, workspaceId, mode):
		cursor = db.cursor()

		if mode is "AdminCheck":
			sql = "SELECT WorkspaceId FROM UsersToWorkspaces WHERE UserId = %s"
		else:
			sql = "SELECT WorkspaceId FROM Workspaces WHERE AdminId = %s"

		try:
			cursor.execute(sql, (userId,))
			data = cursor.fetchall()

			for workspaceIdentifier in data:
				if int(workspaceId) == int(workspaceIdentifier[0]):
					return True

			return False

		except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
			return False

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
			sql = "SELECT Email, Name FROM Users WHERE UserId = %s"

			try:
				cursor.execute(sql, (tokenContents['userId'],))
				data = cursor.fetchone()
				db.close()

				res.status = falcon.HTTP_200
				res.body = '{"success": true, "userId": %s, "email": "%s", "name": "%s"}' % (tokenContents['userId'], data[0], data[1])

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401

	def on_post_register(self, req, res):
		body = self.getBodyFromRequest(req)
		if body == None or 'name' not in body or 'email' not in body or 'password' not in body or 'question' not in body or 'answer' not in body:
			res.body = '{"error":"Name, email, password, security question and answer are required."}'
			res.status = falcon.HTTP_400
		elif len(body['password']) < 8:
			res.body = '{"error":"Password must be at least 8 characters long"}'
			res.status = falcon.HTTP_400
		else:
			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "INSERT INTO Users (Name, Email, Password, SecurityQuestion, SecurityAnswer) VALUES (%s, %s, %s, %s, %s)"
			hashedPassword = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
			hashedAnswer = bcrypt.hashpw(body['answer'].encode('utf-8'), bcrypt.gensalt())

			try:
				cursor.execute(sql, (body['name'], body['email'], hashedPassword, body['question'], hashedAnswer))
				db.commit()
				res.body = '{"success": true}'
				res.status = falcon.HTTP_200
			except (mysql.connector.errors.IntegrityError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

			db.close()

	def on_post_login(self, req, res):
		body = self.getBodyFromRequest(req)
		if body == None or 'email' not in body or 'password' not in body:
			res.body = '{"error":"Email and password are required to login."}'
			res.status = falcon.HTTP_400
		else:
			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "SELECT Password, UserId FROM Users WHERE Email = %s"

			try:
				cursor.execute(sql, (body['email'],))
				data = cursor.fetchone()

				if data == None or len(data) == 0:
					res.body = '{"error":"Invalid credentials"}'
					res.status = falcon.HTTP_401
					db.close()
					return

				if bcrypt.checkpw(body['password'].encode('utf8'), data[0].encode('utf8')):
					token = jwt.encode({'userId':data[1], 'exp':datetime.utcnow() + timedelta(seconds=86400)}, 'secret', algorithm='HS256').decode('utf8')
					res.body = '{"success":true, "token":' + '"{}"'.format(token) + '}'
					res.status = falcon.HTTP_200
				else:
					res.body = '{"error":"Invalid credentials"}'
					res.status = falcon.HTTP_401
			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401

			db.close()

	#Forgot password, get question
	def on_get_forgot(self, req, res):
		email = req.get_param("email")

		if email == None:
			res.body = '{"error":"Email not included in request"}'
			res.status = falcon.HTTP_400
			return

		db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
		cursor = db.cursor()
		sql = "SELECT SecurityQuestion FROM Users WHERE Email = %s"

		try:
			cursor.execute(sql, (email,))
			data = cursor.fetchone()

			if data == None or len(data) == 0:
				res.body = '{"error":"Account not found"}'
				res.status = falcon.HTTP_400
			else:
				res.body = '{"success":true, "question":' + ' "' + data[0] + '"}'
				res.status = falcon.HTTP_200
		except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
			res.body = '{' + '"error":"{}"'.format(e) + '}'
			res.status = falcon.HTTP_401

		db.close()

	#Forgot password, authorize answer
	def on_post_forgot(self, req, res):
		body = self.getBodyFromRequest(req)
		if body == None or 'email' not in body or 'answer' not in body:
			res.body = '{"error":"Email and answer to security question are required."}'
			res.status = falcon.HTTP_400
		else:
			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "SELECT UserId, SecurityAnswer FROM Users WHERE Email = %s"

			try:
				cursor.execute(sql, (body['email'],))
				data = cursor.fetchone()

				if data == None or len(data) == 0:
					res.body = '{"error":"Account not found"}'
					res.status = falcon.HTTP_400
					db.close()
					return

				if bcrypt.checkpw(body['answer'].encode('utf8'), data[1].encode('utf8')):
					token = jwt.encode({'userId':data[0], 'validForPasswordReset':True, 'exp':datetime.utcnow() + timedelta(seconds=300)}, 'secret', algorithm='HS256').decode('utf8')
					res.body = '{"success":true, "resetToken":' + '"{}"'.format(token) + '}'
					res.status = falcon.HTTP_200
				else:
					res.body = '{"error":"Incorrect answer"}'
					res.status = falcon.HTTP_401
			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401

			db.close()

	#Reset password
	def on_post_reset(self, req, res):
		if req.auth == None:
			res.status = falcon.HTTP_401
			res.body = '{"error":"Reset token required"}'
		else:
			tokenContents = self.decodeToken(req.auth)

			if tokenContents == None:
				res.status = falcon.HTTP_401
				res.body = '{"error":"Invalid token"}'
				return

			body = self.getBodyFromRequest(req)

			if body == None or 'password' not in body:
				res.body = '{"error":"New password required."}'
				res.status = falcon.HTTP_400

			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "UPDATE Users SET Password = %s WHERE UserId = %s"

			hashedPassword = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())

			try:
				cursor.execute(sql, (hashedPassword, tokenContents['userId'],))
				db.commit()
				res.body = '{"success": true}'
				res.status = falcon.HTTP_200
			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401

			db.close()
	
	# Assign a user to a workspace
	def on_post_giveaccess(self, req, res, workspaceId, userId):
		print("why wont you work")		
		db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")

		if not self.authroizedWorkspace(db,userId,workspaceId,"Workspaces"):
			res.body = '{"error":"This user does not have permissions to make modifications in this workspace."}'
			res.status = falcon.HTTP_401
			db.close()
			return
		else:
			# admin has permission to make changes
			body = self.getBodyFromRequest(req)

			if body == None or 'newUser' not in body:
				res.body = '{"error":"New User\s name required."}'
				res.status = falcon.HTTP_400
				return
	
			sql = "SELECT UserId FROM Users WHERE Email = %s"

			try:
				cursor = db.cursor()
				cursor.execute(sql, (body['newUser'],))
				data = cursor.fetchone()
				
				if data == None:
					res.body = '{"error":"The specified User is not registered."}'
					res.status = falcon.HTTP_400
					db.close()
					return

				if not authroizedWorkspace(db,data[0],workspaceId,"UsersToWorkspaces"):
					sql3 = "INSERT INTO UsersToWorkspaces (UserId, WorkspaceId) VALUES (%s, %s)"
					
					cursor.execute(sql3, (data[0], workspaceId,))
					db.commit()
					db.close()

			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401
			
