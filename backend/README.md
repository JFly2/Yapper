# Yapper Backend

The Yapper backend is a Spring Boot application that provides authentication, room management, persistent message storage, room membership permissions, and real-time messaging through authenticated STOMP WebSocket connections.

## Tech Stack

* Java 17
* Spring Boot
* Spring Security
* Spring Web MVC
* Spring WebSocket
* STOMP
* SockJS
* Spring Data JPA
* PostgreSQL
* JJWT
* BCrypt
* Lombok
* Maven

## Responsibilities

The backend is responsible for:

* Registering and authenticating users
* Hashing passwords with BCrypt
* Generating and validating JWTs
* Protecting REST endpoints
* Authenticating STOMP WebSocket connections
* Creating and locating chat rooms
* Generating room join codes
* Creating room memberships
* Assigning room owner/member roles
* Loading a user's joined rooms
* Enforcing room permissions
* Allowing owners to delete rooms
* Allowing owners to kick members
* Allowing members to leave rooms
* Saving messages to PostgreSQL
* Loading protected message history
* Determining message sender identity from the authenticated principal
* Broadcasting messages to room-specific WebSocket topics

## Project Structure

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/yapper/backend/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       └── service/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## Authentication

### Registration

Users register with an email, username, and password.

The backend:

1. Checks whether the username already exists.
2. Checks whether the email already exists.
3. Hashes the password with BCrypt.
4. Saves the user to PostgreSQL.

```http
POST /api/auth/register
```

Example request:

```json
{
  "email": "user@example.com",
  "username": "user",
  "password": "password"
}
```

### Login

The backend verifies the submitted credentials and returns a JWT.

```http
POST /api/auth/login
```

Example request:

```json
{
  "username": "user",
  "password": "password"
}
```

Authenticated REST requests must include the token:

```http
Authorization: Bearer <token>
```

## WebSocket Messaging

The WebSocket connection endpoint is:

```text
/ws
```

The client sends its JWT in the STOMP `CONNECT` headers:

```text
Authorization: Bearer <token>
```

A backend channel interceptor:

1. Intercepts the STOMP `CONNECT` frame.
2. Extracts the JWT.
3. Validates the token.
4. Loads the authenticated user.
5. Attaches the user to the WebSocket session as the principal.

Clients send messages to:

```text
/app/yapper.send
```

Clients subscribe to room messages at:

```text
/topic/room/{roomId}
```

Example message payload:

```json
{
  "roomId": 1,
  "content": "Hello"
}
```

The client does not provide the sender name. The backend determines the sender from the authenticated WebSocket principal.

Before saving and broadcasting a WebSocket message, the backend checks that the authenticated user belongs to the room they are sending a message to.

## REST Endpoints

### Authentication

```http
POST /api/auth/register
```

Registers a new user.

```http
POST /api/auth/login
```

Authenticates a user and returns a JWT.

### Messages

```http
GET /api/messages/{roomId}
```

Returns stored message history for a room only if the authenticated user is a member of that room.

```http
POST /api/messages
```

Saves a message through REST only if the authenticated user is a member of that room.

```http
GET /api/messages/test
```

Returns the authenticated username and can be used to test JWT authentication.

### Rooms

```http
POST /api/rooms
```

Creates a room, generates a unique six-character join code, and creates an OWNER membership for the authenticated user.

Example request:

```json
{
  "name": "Weekend Group",
  "publicRoom": false,
  "category": ""
}
```

```http
GET /api/rooms/joined
```

Returns the authenticated user's joined rooms, including their role in each room.

```http
GET /api/rooms/code/{joinCode}
```

Finds a room using its join code.

```http
POST /api/rooms/code/{joinCode}
```

Joins the authenticated user to a room as a MEMBER.

```http
DELETE /api/rooms/{roomId}
```

Deletes a room. Only the OWNER can delete a room.

```http
DELETE /api/rooms/{roomId}/leave
```

Allows a MEMBER to leave a room. Owners cannot leave their own room through this route.

```http
GET /api/rooms/{roomId}/members
```

Returns the members of a room.

```http
DELETE /api/rooms/{roomId}/members/{userId}
```

Allows the OWNER to kick a MEMBER from the room.

## Room Memberships and Roles

Yapper uses a room membership table to track which users belong to which rooms.

Each membership has a role:

```text
OWNER
MEMBER
```

### OWNER

Owners can:

* Open the room
* Send and receive messages
* View room members
* Kick members
* Delete the room

### MEMBER

Members can:

* Open the room
* Send and receive messages
* View room members
* Leave the room

Members cannot delete rooms or kick other users.

## Security and Permission Checks

The backend enforces permissions even if the frontend hides unauthorized actions.

The backend checks that:

* Users must be authenticated before accessing protected routes
* Users can only fetch messages for rooms they belong to
* Users can only send REST messages to rooms they belong to
* Users can only send WebSocket messages to rooms they belong to
* Only owners can delete rooms
* Only owners can kick members
* Owners cannot be kicked through the member-kick endpoint
* Owners cannot leave their own room through the member leave endpoint

## Database Configuration

The backend uses PostgreSQL.

Create the local database:

```sql
CREATE DATABASE yapperdb;
```

Database configuration is located in:

```text
src/main/resources/application.properties
```

Recommended configuration:

```properties
spring.application.name=yapper-backend

spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/yapperdb}
spring.datasource.username=${DB_USERNAME:}
spring.datasource.password=${DB_PASSWORD:}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

Set the database credentials before running the application:

```bash
export DB_URL="jdbc:postgresql://localhost:5432/yapperdb"
export DB_USERNAME="your_postgres_username"
export DB_PASSWORD="your_postgres_password"
```

Do not commit database passwords or JWT secrets.

## Running the Backend

From the repository root:

```bash
cd backend
./mvnw spring-boot:run
```

A globally installed Maven version can also be used:

```bash
cd backend
mvn spring-boot:run
```

The server runs at:

```text
http://localhost:8080
```

A successful startup should include output similar to:

```text
Tomcat started on port 8080
Started YapperBackendApplication
```

## Current Status

The following backend functionality is working:

* User registration and login
* BCrypt password hashing
* JWT generation and validation
* Protected REST endpoints
* Authenticated STOMP connections
* Room creation
* Room lookup by join code
* Joining rooms by code
* Persistent user-room memberships
* Loading a user's joined rooms
* Room ownership
* Owner and member roles
* Owner-only room deletion
* Member room leaving
* Owner-only member kicking
* Room member listing
* Room-based message broadcasting
* Message persistence
* Protected message history retrieval
* Protected WebSocket message sending
* Backend-controlled sender identity
* Message timestamps

## Future Development

Possible future backend features:

* Friends system
* Friend requests
* Direct messages
* Friend-based room invitations
* Online/offline presence
* Room moderators
* Room renaming
* Message editing and deletion
* Typing indicators
* Read receipts
* Refresh tokens
* Production deployment configuration
