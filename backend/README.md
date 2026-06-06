# Yapper Backend

This is the Spring Boot backend for **Yapper**, a real-time chat application with JWT authentication, protected REST endpoints, and authenticated STOMP WebSocket messaging.

## Features

* User registration and login
* BCrypt password hashing
* JWT-based authentication
* Protected REST endpoints
* STOMP WebSocket messaging
* SockJS WebSocket fallback support
* Authenticated WebSocket connections using JWT
* Room-based realtime messaging
* PostgreSQL persistence for users and messages

## Tech Stack

* Java
* Spring Boot
* Spring Security
* Spring WebSocket
* STOMP
* SockJS
* JWT
* PostgreSQL
* Spring Data JPA
* Maven

## Project Structure

```text
src/main/java/com/yapper/backend/
├── config/
│   └── WebSocketConfig
├── controller/
│   ├── AuthController
│   ├── MessageController
│   └── WebSocketController
├── dto/
│   ├── LoginRequest
│   ├── RegisterRequest
│   ├── MessageRequest
│   └── MessageResponse
├── model/
│   ├── User
│   └── Message
├── repository/
│   ├── UserRepository
│   └── MessageRepository
├── security/
│   ├── SecurityConfig
│   ├── JwtService
│   ├── JwtAuthFilter
│   ├── CustUserDetailsService
│   └── WebSocketAuthInterceptor
├── service/
└── YapperBackendApplication
```

## Authentication Flow

### Registration

Users register with:

```json
{
  "email": "user@example.com",
  "username": "user",
  "password": "password"
}
```

The backend checks whether the username or email already exists, hashes the password with BCrypt, and stores the user in PostgreSQL.

### Login

Users log in with:

```json
{
  "username": "user",
  "password": "password"
}
```

If the credentials are valid, the backend returns a JWT token.

The frontend stores this token and sends it with future authenticated requests:

```http
Authorization: Bearer <token>
```

## REST Endpoints

### Auth

```http
POST /api/auth/register
```

Registers a new user.

```http
POST /api/auth/login
```

Authenticates a user and returns a JWT token.

### Messages

```http
GET /api/messages/{roomId}
```

Returns message history for a specific room.

```http
POST /api/messages
```

Saves a message through the REST API. The sender is taken from the authenticated user.

```http
GET /api/messages/test
```

Test endpoint that returns the authenticated username.

## WebSocket Messaging

WebSocket endpoint:

```text
/ws
```

Application destination prefix:

```text
/app
```

Broker destination prefix:

```text
/topic
```

Message send destination:

```text
/app/yapper.send
```

Room subscription destination:

```text
/topic/room/{roomId}
```

Example frontend STOMP message:

```json
{
  "roomId": 1,
  "content": "Hello"
}
```

The backend uses the authenticated WebSocket principal to set the sender automatically.

## WebSocket Authentication

The frontend sends the JWT during STOMP connection:

```javascript
stompClient.connect(
    {
        Authorization: `Bearer ${token}`
    },
    onConnect,
    onError
);
```

The backend intercepts the STOMP `CONNECT` frame, extracts the JWT, validates it, loads the user, and attaches the authenticated principal to the WebSocket session.

## Local Setup

### Prerequisites

* Java 17+
* Maven
* PostgreSQL
* A PostgreSQL database named `yapperdb`

### Database

Create the database:

```sql
CREATE DATABASE yapperdb;
```

### Application Properties

Configure your PostgreSQL connection in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/yapperdb
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Do not commit real database passwords or JWT secrets.

## Running the Backend

From the backend project root:

```bash
./mvnw spring-boot:run
```

Or, if using Maven directly:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## Current Status

Implemented:

* JWT registration and login
* Spring Security filter chain
* JWT validation filter
* Authenticated REST endpoints
* STOMP WebSocket setup
* WebSocket JWT authentication interceptor
* Room-based WebSocket subscriptions
* Backend-controlled message sender identity

In progress:

* React frontend integration
* Realtime message rendering
* Room switching behavior
* Message history loading through REST

## Future Improvements

* Refresh tokens
* Email verification
* Password reset
* Friend system
* Persistent room list
* Private messages
* Typing indicators
* Message timestamps
* Read receipts
* Deployment configuration
