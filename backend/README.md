# Yapper Backend

The Yapper backend is a Spring Boot application that provides authentication, room management, persistent message storage, and real-time messaging through authenticated STOMP WebSocket connections.

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
* Saving messages to PostgreSQL
* Loading message history
* Determining message sender identity from the authenticated principal
* Broadcasting messages to room-specific WebSocket topics

## Project Structure

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/yapper/backend/
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

Clients subscribe to:

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

Returns stored message history for a room.

```http
POST /api/messages
```

Saves a message through REST.

```http
GET /api/messages/test
```

Returns the authenticated username and can be used to test JWT authentication.

### Rooms

```http
POST /api/rooms
```

Creates a room and generates a unique six-character join code.

Example request:

```json
{
  "name": "Weekend Group",
  "publicRoom": false,
  "category": ""
}
```

```http
GET /api/rooms/code/{joinCode}
```

Finds a room using its join code.

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
* Generated room join codes
* Room-based message broadcasting
* Message persistence
* Message history retrieval
* Backend-controlled sender identity
* Message timestamps

## In Development

* Persistent user-room memberships
* Loading a user's joined rooms
* Room ownership
* Room permissions
* Room management endpoints
* Public room discovery
* Category filtering
* Refresh tokens
* Production deployment configuration
