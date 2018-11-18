**There is a Postman collection in this folder that you can use to test all of the endpoints**

-----
Users
-----

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





**4. Give a User Access to Workspace**

Endpoint: `POST 131.104.48.82:5000/workspaces/{WorkspaceId}/users/{UserId}`

In the body, you must include the email of the new user you want to give workspace access to. 
```
{
	"newUser": "example@example.ca"
}
```
If the login is successfull, you will receive 200 status code with the following response:

```
{
	"success": true
}
```
