import falcon
from routes.user import UserRoutes
from routes.workspace import WorkspaceRoutes

app = falcon.API()
userRoutes = UserRoutes()
workspaceRoutes = WorkspaceRoutes()

app.add_route('/user', userRoutes)
app.add_route('/user/register', userRoutes, suffix='register')
app.add_route('/user/login', userRoutes, suffix='login')

app.add_route('/workspaces', workspaceRoutes)
