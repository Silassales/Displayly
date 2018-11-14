import falcon
from routes.user import UserRoutes
from routes.workspace import WorkspaceRoutes
from routes.display import DisplayRoutes

app = falcon.API()
userRoutes = UserRoutes()
workspaceRoutes = WorkspaceRoutes()
displayRoutes = DisplayRoutes()

app.add_route('/user', userRoutes)
app.add_route('/user/register', userRoutes, suffix='register')
app.add_route('/user/login', userRoutes, suffix='login')

app.add_route('/workspaces', workspaceRoutes)

app.add_route('/displays', displayRoutes)