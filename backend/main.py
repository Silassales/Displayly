import falcon
from routes.user import UserRoutes

app = falcon.API()
userRoutes = UserRoutes()
app.add_route('/user', userRoutes)
app.add_route('/user/register', userRoutes, suffix='register')
app.add_route('/user/login', userRoutes, suffix='login')
