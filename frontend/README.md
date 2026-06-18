# Yapper Frontend

The Yapper frontend is a React and Vite application that provides the user interface for authentication, joining chat rooms, switching between rooms, loading message history, and exchanging messages in real time.

## Tech Stack

* React
* Vite
* JavaScript
* React Router
* Axios
* STOMP.js
* SockJS
* CSS

## Responsibilities

The frontend is responsible for:

* Displaying registration and login forms
* Storing the JWT after login
* Sending authenticated REST requests
* Establishing an authenticated STOMP connection
* Joining rooms using room codes
* Loading room message history
* Subscribing to room-specific WebSocket topics
* Sending and displaying real-time messages
* Switching between joined rooms
* Displaying timestamps and date dividers
* Styling the authenticated user's messages separately
* Logging the user out

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

The exact component structure may change as development continues.

## Main Pages

### Registration Page

The registration page collects:

* Email
* Username
* Password

It sends the registration request to:

```http
POST /api/auth/register
```

### Login Page

The login page collects a username and password.

It sends the login request to:

```http
POST /api/auth/login
```

After a successful login, the JWT is stored in local storage:

```javascript
localStorage.setItem("jwt_token", token);
```

The user is then redirected to the chat interface.

### Chat Page

The chat page contains the main room and messaging interface.

It supports:

* WebSocket connection status
* Joining rooms by code
* Switching between rooms
* Loading message history
* Receiving messages in real time
* Sending messages
* Logging out

## Main Components

### `ChatBox`

Controls the main chat behavior, including:

* Establishing the STOMP connection
* Managing the active room
* Subscribing and unsubscribing from room topics
* Loading message history
* Sending messages
* Receiving live messages

### `RoomSidebar`

Displays joined rooms and allows the user to:

* Enter a room join code
* Join a room
* Select an existing joined room
* Collapse or expand the sidebar

Joined rooms are currently stored in React state and disappear after a browser refresh.

### `MessageList`

Displays the current room's messages and automatically scrolls toward the newest message.

### `Message`

Displays an individual message, including:

* Sender
* Message content
* Timestamp
* Styling based on whether the message belongs to the authenticated user

### `MessageInput`

Provides a controlled input and send button for sending messages to the active room.

## Backend Communication

The frontend communicates with the backend at:

```text
http://localhost:8080
```

Axios is used for REST requests.

Authenticated requests include:

```http
Authorization: Bearer <token>
```

The WebSocket connection uses:

```text
http://localhost:8080/ws
```

The JWT is included in the STOMP `CONNECT` headers:

```javascript
stompClient.connect(
  {
    Authorization: `Bearer ${token}`
  },
  onConnect,
  onError
);
```

Messages are sent to:

```text
/app/yapper.send
```

The active room subscription uses:

```text
/topic/room/{roomId}
```

## Room Joining Flow

The user enters a six-character room code.

The frontend requests the room from:

```http
GET /api/rooms/code/{joinCode}
```

After receiving the room:

1. The room is added to the joined-room sidebar.
2. The room becomes the active room.
3. Stored message history is requested.
4. The previous WebSocket subscription is removed.
5. The frontend subscribes to the new room's topic.

The room name is displayed in the interface, while the numeric room ID is used internally.

## Running the Frontend

The backend should be running first.

From the repository root:

```bash
cd frontend
```

Install dependencies:

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

## Available Scripts

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Current Status

The following frontend functionality is working:

* Registration page
* Login page
* JWT storage
* Authenticated API requests
* Authenticated STOMP connections
* Chat interface
* Joining rooms by code
* Room switching
* Joined-room sidebar
* Collapsible sidebar
* Message history loading
* Sending real-time messages
* Receiving real-time messages
* Message timestamps
* Date dividers
* Separate styling for the authenticated user's messages
* Logout

## In Development

* Frontend room-creation form
* Persistent joined-room list
* Loading joined rooms after login or refresh
* User-facing invalid join-code errors
* Public room discovery
* Room category browsing
* Room ownership and management controls
* Improved connection and reconnection handling
* Production deployment configuration

## Current Limitations

* Joined rooms are stored only in React state.
* Joined rooms disappear after a browser refresh.
* Rooms cannot yet be created through the frontend.
* Invalid join-code errors are currently logged to the browser console.
* Public room discovery is not yet available.
