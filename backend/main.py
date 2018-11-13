import Falcon
from backend import UserRoutes

def main():
	print("python main function")


	app = falcon.API()

	userRoutes = UserRoutes()

	app.add_route('/user', userRoutes)


if __name__ == '__main__':
	main()