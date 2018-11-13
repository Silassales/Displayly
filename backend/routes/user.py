import falcon
import mysql.connector

class UserRoutes(object):
	def on_get(self, req, res):
		mydb = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306")
		res.status = falcon.HTTP_200  # This is the default status
		res.body = ('This is me, Falcon, serving a resource!')
		mydb.close()

	def on_post_register(self, req, res):
		if 'username' not in req.params or 'password' not in req.params or 'question' not in req.params or 'answer' not in req.params:
			res.body = '{"error":"Username, password, security question and answer are required."}'
			res.status = falcon.HTTP_400
		else:
			print(req.body)

	def on_post_login(self, req, res):
		res.status = falcon.HTTP_200
