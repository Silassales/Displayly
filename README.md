To set up the database:

Download postgresql 10.5 from here: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

Create superuser 'displaylyUser' with password as 'password':

```postgresql
CREATE USER displaylyUser WITH
	LOGIN
	SUPERUSER
	CREATEDB
	CREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'password';
```

Create database with this command (assuming you have superuser 'displaylyUser'):

```postgresql
CREATE DATABASE "Displayly"
    WITH
    OWNER = "displaylyUser"
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```

Create Users table in database:

```postgresql
CREATE TABLE public."Users"
(
    id serial NOT NULL,
    email character(80) NOT NULL,
    hash character(256) NOT NULL,
    authorities text[] NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public."Users"
    OWNER to "displaylyUser";
```


To Register a user to the system:

POST ``http://localhost:8080/users/sign-up`` with json body:
```json
{
	"email": "test@test.com",
	"password": "password"
}
```
To login to the system:

POST ``http://localhost:8080/login`` with json body:
```json
{
	"email": "test@test.com",
	"password": "password"
}
```
A response token will be issued if the authentication was successful. This token must be sent as the header param ``api-key`` along with any sensitive request or a 403 forbidden error will be returned.