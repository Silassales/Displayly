import falcon
import mysql.connector

class UserRoutes(object):
	def on_get(self, req, res):
		mydb = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306")
		res.status = falcon.HTTP_200  # This is the default status
		res.body = ('This is me, Falcon, serving a resource!')
		mydb.close()

	def on_post(self, req, res):
		print(req.body)
