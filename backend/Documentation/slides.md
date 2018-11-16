**There is a Postman collection in this folder that you can use to test all of the endpoints**

------
Slides
------

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
		},
		{
			"name": "Image2.jpg",
			"data": base_64_encoded_string
		},
		{
			"name": "Image3.jpg",
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
    "slideId": #
}
```

* `slideId`: The ID of the newly created slide.

**2. Get A List Of Slides**

Endpoint: `GET http://131.104.48.83:5000/workspaces/{workspaceId}/slides`

There is no body required, instead, to get a list of slides belonging existing within a workspace, you specify the Workspace ID directly in the URL. For example, if I wanted to see the list of slides for a workspace with ID 1: `GET http://131.104.48.83:5000/workspaces/1/slides`.

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to access its slides.

**NOTE:** This endpoint does not return the file paths of the actual images within a slide. To fetch the images see the next endpoint described in this section

A sample response would look like:

```
{
    "success": true,
    "slides": [
        {
            "id": 21,
            "name": "A test slide",
            "layoutId": 1
        }
    ]
}
```

**3. Get Images Within A Slide**

Endpoint: `GET http://131.104.48.83:5000/workspaces/{workspaceId}/slides/{slideId}`

There is no body required, instead, to get the images that belong in a slide, you specify the Workspace ID and Slide ID directly in the URL. For example, if I wanted to get the list of images with a slide with Slide ID 2 which belongs to a workspace with Workspace ID 1: `GET http://131.104.48.83:5000/workspaces/1/slides/2`.

In order to access this endpoint, you must include the JWT token in the `Authorization` header of the network request. Only users who have access to the specified `workspaceId` will be able to access its slides/images.

A sample response would look like:

```
{
    "success": true,
    "images": [
		"/var/images/57_test1.jpg",
		"/var/images/57_test2.jpg",
		"/var/images/57_test3.jpg"
    ]
}
```