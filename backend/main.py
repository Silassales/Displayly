from flask_api import FlaskAPI
from routes.user import UserRoutes

app = FlaskAPI(__name__)
userRoutes = UserRoutes(app)
app.add_route('/user', userRoutes, suffix='register')
