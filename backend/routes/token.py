import falcon
import jwt
from datetime import datetime, timedelta

class TokenRoutes(object):
	def decodeToken(self, token, expectedResetToken = False):
		try:
			options = {'verify_exp': True}
			decodedToken = jwt.decode(token, 'secret', verify='True', algorithms=['HS256'], options=options)

			if expectedResetToken == False or decodedToken["validForPasswordReset"] == None:
				return decodedToken
				return None
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
				else:
					token = jwt.encode({'userId':tokenContents['userId'], 'exp':datetime.utcnow() + timedelta(seconds=1800)}, 'secret', algorithm='HS256').decode('utf8')
					res.body = '{"success":true, "token":' + '"{}"'.format(token) + '}'
					res.status = falcon.HTTP_200