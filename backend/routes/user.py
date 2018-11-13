import falcon
import json
import bcrypt
import mysql.connector

class UserRoutes(object):
	def getBodyFromRequest(self, req):
		raw_json = req.bounded_stream.read()
		data = raw_json.decode('utf8').replace("'", '"')
		return json.loads(data)

	def on_get(self, req, res):
		res.status = falcon.HTTP_200
		res.body = ('This is me, Falcon, serving a resource!')
		mydb.close()

	def on_post_register(self, req, res):
		body = self.getBodyFromRequest(req)
		if 'name' not in body or 'email' not in body or 'password' not in body or 'question' not in body or 'answer' not in body:
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
			except (mysql.connector.errors.IntegrityError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_400

	def on_post_login(self, req, res):
		body = self.getBodyFromRequest(req)
		if 'email' not in body or 'password' not in body:
			res.body = '{"error":"Email and password are required to login."}'
			res.status = falcon.HTTP_400
		else:
			db = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306", db="displayly")
			cursor = db.cursor()
			sql = "SELECT Password FROM Users WHERE Email = '%s'"
			try:
				cursor.execute(sql, (body['email']))
				data = cursor.fetchone()
				
				print(data)
				if len(data) == 0
					res.body = '{"error":"Invalid credentials"}'
					res.status = falcon.HTTP_401
				
				if bcrypt.checkpw(body['password'], data[0][0]):
					res.status = falcon.HTTP_200
				else:
					res.status = falcon.HTTP_401
			except (mysql.connector.errors.IntegrityError, mysql.connector.errors.ProgrammingError) as e:
				res.body = '{' + '"error":"{}"'.format(e) + '}'
				res.status = falcon.HTTP_401
