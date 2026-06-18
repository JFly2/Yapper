# Yapper

Yapper is a full-stack real-time chat application built with Spring Boot and React. It supports JWT authentication, authenticated WebSocket communication, room-based messaging, persistent message history, and PostgreSQL storage.

Users can register, log in, join rooms using generated join codes, switch between rooms, and exchange messages in real time.

## Features

### Authentication

* User registration and login
* BCrypt password hashing
* JWT generation and validation
* Protected REST endpoints
* Authenticated STOMP WebSocket connections
* Logout functionality

### Messaging

* Real-time messaging with STOMP and SockJS
* Room-based WebSocket subscriptions
* PostgreSQL message persistence
* Message history loading
* Backend-controlled sender identity
* Message timestamps
* Message date dividers
* Separate styling for the authenticated user's messages

### Rooms

* PostgreSQL-backed room records
* Generated six-character join codes
* Join rooms by code
* Internal numeric room IDs
* User-facing room names
* Public or private room setting
* Optional room categories
* Room switching
* Joined-room sidebar
* Collapsible sidebar

Joined rooms are currently stored in frontend state and reset when the page is refreshed. Persistent user-room membership is in development.

## Tech Stack

### Backend

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

### Frontend

* React
* Vite
* JavaScript
* React Router
* Axios
* STOMP.js
* SockJS
* CSS

## Repository Structure

```text
yapper/
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── README.md
│
└── README.md
```

The backend and frontend each include their own README with more detailed documentation.

## Application Flow

### Registration

Users register with an email, username, and password.

The backend:

1. Checks whether the username already exists.
2. Checks whether the email already exists.
3. Hashes the password with BCrypt.
4. Stores the user in PostgreSQL.

Example request:

```json
{
  "email": "user@example.com",
  "username": "user",
  "password": "password"
}
```

### Login

Users log in with a username and password.

The backend:

1. Finds the user by username.
2. Verifies the submitted password with BCrypt.
3. Generates a JWT.
4. Returns the token to the frontend.

Example request:

```json
{
  "username": "user",
  "password": "password"
}
```

The frontend stores the JWT in local storage:

```javascript
localStorage.setItem("jwt_token", token);
```

The token is included in authenticated REST requests:

```http
Authorization: Bearer <token>
```

## Room Flow

Rooms use two identifiers:

* `id`: internal numeric database ID
* `joinCode`: user-facing code used to find and join a room

Example room response:

```json
{
  "id": 1,
  "name": "Weekend Group",
  "joinCode": "NF5V9H",
  "publicRoom": false,
  "category": null
}
```

The room-joining flow is:

```text
User enters a join code
        ↓
Frontend requests the room by code
        ↓
Backend returns the room
        ↓
Frontend adds and selects the room
        ↓
Stored message history is loaded
        ↓
Frontend subscribes to the room's WebSocket topic
```

The room name and join code are displayed to the user. The numeric room ID is used internally for database operations, message history, and WebSocket subscriptions.

## WebSocket Flow

The frontend connects to the backend WebSocket endpoint:

```text
/ws
```

The JWT is sent in the STOMP `CONNECT` headers:

```javascript
stompClient.connect(
  {
    Authorization: `Bearer ${token}`
  },
  onConnect,
  onError
);
```

The backend WebSocket interceptor:

1. Intercepts the STOMP `CONNECT` frame.
2. Extracts the JWT.
3. Validates the token.
4. Loads the authenticated user.
5. Attaches the user to the WebSocket session as the principal.

Messages are sent to:

```text
/app/yapper.send
```

Clients subscribe to:

```text
/topic/room/{roomId}
```

Example outgoing message payload:

```json
{
  "roomId": 1,
  "content": "Hello"
}
```

The frontend does not provide the sender name. The backend determines the sender from the authenticated WebSocket principal.

## REST API

### Authentication

#### Register a user

```http
POST /api/auth/register
```

Registers a new user with an email, username, and password.

#### Log in

```http
POST /api/auth/login
```

Authenticates a user and returns a JWT.

### Messages

#### Get message history

```http
GET /api/messages/{roomId}
```

Returns the stored messages for a room.

#### Save a message through REST

```http
POST /api/messages
```

Saves a message through the REST API. Messages are normally sent through WebSocket.

#### Verify authentication

```http
GET /api/messages/test
```

Returns the authenticated username and can be used to verify a JWT.

### Rooms

#### Create a room

```http
POST /api/rooms
```

Example request:

```json
{
  "name": "Weekend Group",
  "publicRoom": false,
  "category": ""
}
```

The backend creates the room and generates a unique six-character join code.

#### Find a room by join code

```http
GET /api/rooms/code/{joinCode}
```

Example:

```http
GET /api/rooms/code/NF5V9H
```

## Local Development

### Prerequisites

Install the following:

* JDK 17 or newer
* Node.js
* npm
* PostgreSQL

The repository includes the Maven wrapper, so Maven does not need to be installed globally.

Verify Java:

```bash
java -version
```

## Backend Setup

From the repository root, navigate to the backend:

```bash
cd backend
```

Create the PostgreSQL database:

```sql
CREATE DATABASE yapperdb;
```

Configure the database connection in:

```text
backend/src/main/resources/application.properties
```

Example configuration:

```properties
spring.application.name=yapper-backend

spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/yapperdb}
spring.datasource.username=${DB_USERNAME:}
spring.datasource.password=${DB_PASSWORD:}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

Set the local database credentials:

```bash
export DB_URL="jdbc:postgresql://localhost:5432/yapperdb"
export DB_USERNAME="your_postgres_username"
export DB_PASSWORD="your_postgres_password"
```

Run the backend with the Maven wrapper:

```bash
./mvnw spring-boot:run
```

A globally installed Maven version can also be used:

```bash
mvn spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

A successful startup should include output similar to:

```text
Tomcat started on port 8080
Started YapperBackendApplication
```

The first startup may take longer while Maven downloads the required dependencies.

## Frontend Setup

From the repository root, navigate to the frontend:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

Open that address in a browser.

The backend must be running for authentication, room lookup, message history, and WebSocket messaging to work.

## Starting the Project After Initial Setup

Open one terminal and start the backend:

```bash
cd backend
./mvnw spring-boot:run
```

Open another terminal and start the frontend:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Development Status

The core authentication, room lookup, message persistence, and real-time messaging flows are functional.

Currently in development:

* Frontend room-creation form
* Persistent user-room memberships
* Loading joined rooms after login or refresh
* Room ownership
* Room management controls
* Public room discovery
* Category filtering
* User-facing invalid join-code errors
* Improved WebSocket reconnect handling
* Production deployment configuration

## Current Limitations

* Joined rooms are stored only in React state.
* Joined rooms disappear after a browser refresh.
* Rooms cannot yet be created through the frontend.
* Public room discovery is not yet implemented.
* Room ownership and deletion permissions are not yet implemented.
* Invalid join-code errors are logged to the browser console instead of being displayed in the interface.

## Roadmap

* Persistent user-room membership table
* Leave-room functionality
* Room ownership and permissions
* Rename-room functionality
* Delete-room functionality for room owners
* Public room search
* Room category browsing
* Refresh tokens
* Email verification
* Password reset
* Private messages
* Friend system
* Typing indicators
* Read receipts
* Online presence
* Improved reconnect handling
* Production database configuration
* Backend and frontend deployment

## Security

* Passwords are hashed with BCrypt.
* JWTs are required for protected REST endpoints.
* JWTs are validated when establishing STOMP connections.
* Message sender identity is determined by the authenticated backend principal.
* Database credentials and JWT secrets should not be committed to Git.
* Local request files containing active JWTs should not be committed.

## Project Status

Yapper is under active development. Its core authentication, room lookup, message persistence, and real-time chat functionality are working. The next major development step is persistent room membership so users retain their joined rooms across sessions.
