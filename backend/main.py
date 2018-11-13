import falcon
from routes.user import UserRoutes

app = falcon.API()
userRoutes = UserRoutes()
app.add_route('/user', userRoutes, suffix='register')
