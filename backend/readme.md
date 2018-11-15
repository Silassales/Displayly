-----------------
Starting The API
----------------

To start the API, navigate to the following location on the server: `~/Displaly/backend` and then enter the following command:

`gunicorn -b 131.104.48.83:5000 main:app --reload`

NOTE: To stop the API you will need to kill the actual process for now. Also worth noting, stoping the API does not kill the SQL Database (no data will be lost).

-------------
API Reference
-------------

**There is a Postman collection in this folder that you can use to test all of the endpoints**

* Users: https://github.com/jzavarella/Displayly/tree/master/backend#users
* Resetting Passwords: https://github.com/jzavarella/Displayly/tree/master/backend#reseting-passwords
* Workspaces: https://github.com/jzavarella/Displayly/tree/master/backend#workspaces
* Scenes: https://github.com/jzavarella/Displayly/tree/master/backend#scenes
* Slides: https://github.com/jzavarella/Displayly/tree/master/backend#slides
* Displays: https://github.com/jzavarella/Displayly/tree/master/backend#displays

### Users

**1. Registering A New User**

Endpoint: `POST 131.104.48.83:5000/user/register`

In the body, you must include the following properties: Name, Email, Password, Security Question, and Security Answer.
If the registration is successful, 200 status code will be returned, otherwise 400 with a description explaining why the account could not be created. 

An example of the body might look like:

```
{
	"email": "someone@uoguelph.ca",
	"password": "mypassword123",
	"question": "Where were you born?",
	"answer": "Toronto",
	"name": "Billy Bob"
}
```

**2. Login**

Endpoint: `POST 131.104.48.83:5000/user/login`

In the body, you must include the following properties: Email, and Password. If the login is successfull, you will receive 200 status code with the following response:

```
{
	"success": true,
	"token": jwt_token_here
}
```

The JWT token must be used in future API requests that require a user to be authenticated so make sure to save the token!

**3. Get User Info**

Endpoint: `GET 131.104.48.83:5000/user`

This endpoint will return the following information regarding the user: User ID, Name, and Email

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request for the user you are trying to get details for.

----

### Reseting Passwords

There are 3 steps to resetting a password: getting the security question, validating the answer, and then changing the password. There is an endpoint for each step as described below:

**1. Get Security Question**

Endpoint: `GET http://131.104.48.83:5000/user/forgot?email={email}`

`{email}`: The email address that belongs to the account whose password we are trying to change

If the email is valid, the question will be returned in the body:

```
{
    "success": true,
    "question": "Where were you born?"
}
```

**2. Validating The Security Question Answer**

Endpoint: `POST http://131.104.48.83:5000/user/forgot`

In the body, you must include two properties; one that contains the email address of the account whose password we are trying to change, and another that contains the answer to the question:

```
{
	"email": "dbianchi@uoguelph.com",
	"answer": "Toronto"
}
```
If the answer is incorrect, a `401` error will be returned. If the answer is correct, a password reset access token will be returned in the body:

```
{
    "success": true,
    "resetToken": reset_token_here
}
```

**IMPORTANT**: The reset access token can only be used in the next endpoint described and will expire 5 minutes after being issued. If the token expiries, you will need to call this endpoint again to get a new token.

**3. Resetting The Password**

Endpoint: `POST http://131.104.48.83:5000/user/reset`

In the body, you must include a property containing the new password:

```
{
	"password": "newPassword"
}
```

In order to access this endpoint, you must include the JWT password reset token in the `Authorization` header of the network request.

If the password is successfully saved, a `200` status code will be returned, otherwise `400` or `401` with a description explaining why the password could not be reset.

**IMPORTANT**: The reset access token will expire 5 minutes after being issued. If the token expiries, you will need to call the previous endpoint (answer validation) to get a new token. Also, after reseting the password, this token can not be used to access other endpoints. You will need to login using the proper login endpoint to get a "full" access token.

----

### JWT Token Refreshing

Endpoint: `GET http://131.104.48.83:5000/token`

When a user logs in, the JWT token generate is set to expire in 30 minutes. Use this endpoint to get a new JWT token that will expiry 30 minutes from when it is issued.

In order to access this endpoint, you must include the current JWT token in the `Authorization` header of the network request. Also worth noting, if you attempt to call this endpoint after the current JWT token expires, you will need to use the login endpoint instead. 

----

### Workspaces

**1. Create A New Workspace**

Endpoint: `POST http://131.104.48.83:5000/workspaces`

In the body, you must include the following properties: Name (the name of the workspace).

```
{
	"name": "Name of workspace"
}
```

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. The user in which the JWT belongs to will be automatically assigned as the admin for the new workspace.

If created successfully, the following will be returned:

```
{
	"success": true,
	"workspaceId": #
}
```

**2. Get A List Of Workspaces For A User**

Endpoint: `GET http://131.104.48.83:5000/workspaces`

There is no body require for this endpoint. Simply provide the JWT token in the `Authorization` header for the user whom you wish to get a list of their workspaces.

If a user belongs to two workspaces, the response would look like:

```
{
    "success": true,
    "workspaces": [
        {
            "id": 1,
            "name": "A workspace",
	    "isAdmin": true
        },
        {
            "id": 2,
            "name": "Another workspace",
	    "isAdmin": false
        }
    ]
}
```

----

### Scenes

**1. Create A New Scene**

Endpoint: `POST http://131.104.48.83:5000/workspaces/{workspaceId}/scenes`

`workspaceId`: The ID of the workspace you wish to add a scene to.

In the body, you must include the following properties: Name (the name of the scene).

```
{
	"name": "Name of scene"
}
```

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to add displays to it

If created successfully, the following will be returned:

```
{
	"success": true,
	"sceneId": #
}
```

**2. Get List Of Scenes In Workspace**

Endpoint: `GET http://131.104.48.83:5000/workspaces/{workspaceId}/scenes`

There is no body required, instead, to get a list of scenes belonging to a workspace, you specify the Workspace ID directly in the URL. For example, if I wanted to see the list of scenes for a workspace with ID 1: `GET http://131.104.48.83:5000/workspaces/1/scenes`.

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to access its scenes.

A sample response would look like:

```
{
    "success": true,
    "scenes": [
        {
            "id": 1,
            "name": "A scene"
        },
        {
            "id": 2,
            "name": "Another scene"
        }
    ]
}
```

* `id`: A unique identifier for the scene.
* `name`: The name of the scene. This is not unique.

----

### Slides

**1. Create A New Slide**

Endpoint: `POST http://131.104.48.83:5000/workspaces/{workspaceId}/slides`

In the body you must include several properties as described below:

```
{
	"name": "A slide",
	"layoutId": 1,
	"images" : [
		{
			"name": "Image1.jpg",
			"data": base_64_encoded_string
		}
	]
}
```

* `name`: The name of the slide. This is not unique.
* `layoutId`: The layout of the slide. Currently, there are only two valid layouts. `1` for 3 images, `2` for 6 images.
* `images`: An array of all the images being used on the slide. 
* * `name`: The name of the image.
* * `data`: A Base64 encoded string of the image.

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to add displays to it.

It is also worth noting that the images sent in the body of this endpoint will be decoded, and saved on the server.

If the slide is saved successfully, the following will be returned:

```
{
    "success": true,
    "slideId": 19
}
```

* `slideId`: The ID of the newly created slide.

----

### Displays

**1. Create A New Display**

Endpoint: `POST http://131.104.48.83:5000/workspaces/{workspaceId}/displays`

In the body, you must include the following properties: Name (the name of the display). In the actual URL, you must specify the workspace ID that you wish to add the display to. For example:

`POST http://131.104.48.83:5000/workspaces/1/displays`

```
{
	"name": "Name of display",
}
```

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to add displays to it.

If created successfully, the following will be returned (where `displayId` refers to the unique id belonging to the display):

```
{
	"success": true,
	"displayId": #
}
```
**2. Get A List Of Displays In A Workspace**

Endpoint: `GET http://131.104.48.83:5000/workspaces/{workspaceId}/displays`

There is no body required, instead, to get a list of displays belonging to a workspace, you specify the Workspace ID directly in the URL. For example, if I wanted to see the list of displays for a workspace with ID 1: `GET http://131.104.48.83:5000/workspaces/1/displays`.

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to access its displays.

A sample response would look like:

```
{
    "success": true,
    "displays": [
        {
            "id": 1,
            "name": "A display",
            "sceneId": null
        },
        {
            "id": 2,
            "name": "Another display",
            "sceneId": 1
        }
    ]
}
```

* `id`: A unique identifier for the display.
* `name`: The name of the display. This is not unique.
* `sceneId`: The unique identifier of the scene that is currently being displayed on the display. `null` if no scene is assigned to the display.
