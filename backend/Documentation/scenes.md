**There is a Postman collection in this folder that you can use to test all of the endpoints**

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