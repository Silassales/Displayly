-----------------
Starting The API
----------------

To start the API, navigate to the following location on the server: "~/Displaly/backend" and then enter the following command:

`gunicorn -b 131.104.48.83:5000 main:app --reload`

NOTE: To stop the API you will need to kill the actual process for now. Also worth noting, stoping the API does not kill the SQL Database (no data will be lost).

-------------
API Reference
-------------

**There is a Postman collection in this folder that you can use to test all of the endpoints**

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

### Displays

**1. Create A New Display**

Endpoint: `POST http://131.104.48.83:5000/displays/{workspaceId}`

In the body, you must include the following properties: Name (the name of the display). In the actual URL, you must specify the workspace ID that you wish to add the display to. For example:

`POST http://131.104.48.83:5000/displays/1`

```
{
	"name": "Name of display",
}
```

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to add displays to it

If created successfully, the following will be returned (where `displayId` refers to the unique id belonging to the display):

```
{
	"success": true,
	"displayId": #
}
```
**2. Get A List Of Displays In A Workspace**

Endpoint: `GET http://131.104.48.83:5000/displays/{workspaceId}`

There is no body required, instead, to get a list of displays belonging to a workspace, you specify the Workspace ID directly in the URL. For example, if I wanted to see the list of displays for a workspace with ID 1: `GET http://131.104.48.83:5000/displays/1`.

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to access its displays.

A sample response would look like:

```
{
    "success": true,
    "displays": [
        {
            "id": 1,
            "name": "A display"
        },
        {
            "id": 2,
            "name": "Another display",
        }
    ]
}
```
