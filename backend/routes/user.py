from flask_api import FlaskAPI
import mysql.connector

class UserRoutes():
	def __init__(self, app):
		self._app = app

	# def on_get(self, req, res):
	# 	mydb = mysql.connector.connect(host="localhost", user="root", password="de5ign", port="3306")
	# 	res.status = falcon.HTTP_200  # This is the default status
	# 	res.body = ('This is me, Falcon, serving a resource!')
	# 	mydb.close()

	@_app.route("/user/register", methods=['GET', 'POST'])
	def on_post_register(self, req, res):
		if 'username' not in req.params or 'password' not in req.params or 'question' not in req.params or 'answer' not in req.params:
			resp.body = json.dumps(doc, ensure_ascii=False)
			resp.status = falcon.HTTP_400
		else:
			print(req.body)
