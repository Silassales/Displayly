**There is a Postman collection in this folder that you can use to test all of the endpoints**

--------
Displays
--------

**1. Create A New Display**

Endpoint: `POST http://131.104.48.82:5000/workspaces/{workspaceId}/displays`

In the body, you must include the following properties: Name (the name of the display). In the actual URL, you must specify the workspace ID that you wish to add the display to. For example:

`POST http://131.104.48.82:5000/workspaces/1/displays`

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

Endpoint: `GET http://131.104.48.82:5000/workspaces/{workspaceId}/displays`

There is no body required, instead, to get a list of displays belonging to a workspace, you specify the Workspace ID directly in the URL. For example, if I wanted to see the list of displays for a workspace with ID 1: `GET http://131.104.48.82:5000/workspaces/1/displays`.

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

**3. Assign A Scene To A Display**

Endpoint: `PUT http://131.104.48.82:5000/workspaces/{workspaceId}/displays/{displayId}`

In the body you must include the ID of the scene you wish to assign to the display:

```
{
    "sceneId": #
}
```

If you want to unassign a scene to a display (effectively making the display show nothing):

```
{
    "sceneId": null
}
```

If changed successfully, a `200` status code will be returned. Otherwise, `400` or `401` with an error message.

**NOTE:** Only one scene can be assigned to a display.

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to modify its displays.
