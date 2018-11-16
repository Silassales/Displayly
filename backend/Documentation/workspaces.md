**There is a Postman collection in this folder that you can use to test all of the endpoints**

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