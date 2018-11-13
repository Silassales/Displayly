import falcon
import json
import jwt
import bcrypt
import mysql.connector
from datetime import datetime, timedelta

class UserRoutes(object):
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
		else:
			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "INSERT INTO Users (Name, Email, Password, SecurityQuestion, SecurityAnswer) VALUES (%s, %s, %s, %s, %s)"
			hashedPassword = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
			hashedQuestion = bcrypt.hashpw(body['question'].encode('utf-8'), bcrypt.gensalt())
			hashedAnswer = bcrypt.hashpw(body['answer'].encode('utf-8'), bcrypt.gensalt())

			try:
				cursor.execute(sql, (body['name'], body['email'], hashedPassword, hashedQuestion, hashedAnswer))
				db.commit()
				res.body = '{"success":"New account created."}'
				res.status = falcon.HTTP_200
				db.close()
			except (mysql.connector.errors.IntegrityError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

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
				db.close()

				if data == None or len(data) == 0:
					res.body = '{"error":"Invalid credentials"}'
					res.status = falcon.HTTP_401
					return

				if bcrypt.checkpw(body['password'].encode('utf8'), data[0].encode('utf8')):
					token = jwt.encode({'userId':data[1], 'exp':datetime.utcnow() + timedelta(seconds=60)}, 'secret', algorithm='HS256').decode('utf8')
					res.body = '{"success":true, "token":' + '"{}"'.format(token) + '}'
					res.status = falcon.HTTP_200
				else:
					res.body = '{"error":"Invalid credentials"}'
					res.status = falcon.HTTP_401
			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401
