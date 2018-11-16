-----------------
Starting The API
----------------

To start the API, navigate to the following location on the server: `~/Displaly/backend` and then enter the following command:

`gunicorn -b 131.104.48.83:5000 main:app --reload`

NOTE: To stop the API you will need to kill the actual process for now. Also worth noting, stoping the API does not kill the SQL Database (no data will be lost).