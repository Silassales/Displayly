import falcon
from routes.user import UserRoutes
from routes.workspace import WorkspaceRoutes
from routes.display import DisplayRoutes
from routes.token import TokenRoutes
#from routes.scene import SceneRoutes
from falcon.http_status import HTTPStatus

class HandleCORS(object):
	def process_request(self, req, resp):
		resp.set_header('Access-Control-Allow-Origin', '*')
		resp.set_header('Access-Control-Allow-Methods', '*')
		resp.set_header('Access-Control-Allow-Headers', '*')
		resp.set_header('Access-Control-Max-Age', 1728000)  # 20 days
		if req.method == 'OPTIONS':
			raise HTTPStatus(falcon.HTTP_200, body='\n')


app = falcon.API(middleware=[HandleCORS()])
userRoutes = UserRoutes()
workspaceRoutes = WorkspaceRoutes()
displayRoutes = DisplayRoutes()
tokenRoutes = TokenRoutes()
#sceneRoutes = SceneRoutes()

app.add_route('/user', userRoutes)
app.add_route('/user/register', userRoutes, suffix='register')
app.add_route('/user/login', userRoutes, suffix='login')
app.add_route('/user/forgot', userRoutes, suffix='forgot')
app.add_route('/user/reset', userRoutes, suffix='reset')

app.add_route('/token', tokenRoutes)

app.add_route('/workspaces', workspaceRoutes)

#app.add_route('/scenes', sceneRoutes)

app.add_route('/displays', displayRoutes)
app.add_route('/displays/{workspaceId}', displayRoutes)
