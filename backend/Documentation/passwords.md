**There is a Postman collection in this folder that you can use to test all of the endpoints**

-------------------
Resetting Passwords
-------------------

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