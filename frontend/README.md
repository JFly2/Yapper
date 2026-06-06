# Yapper Frontend

Yapper Frontend is the React frontend for **Yapper**, a real-time chat application with JWT authentication, room-based messaging, and STOMP WebSocket communication.

## Features

* User registration page
* User login page
* JWT token storage
* Protected chat page
* Room selection sidebar
* Realtime chat interface
* STOMP WebSocket connection
* Authenticated WebSocket connection using JWT
* Message input and message list components
* Axios API setup for backend communication

## Tech Stack

* React
* Vite
* JavaScript
* React Router
* Axios
* STOMP.js
* SockJS
* CSS

## Project Structure

```text
src/
├── components/
│   ├── ChatBox.jsx
│   ├── Message.jsx
│   ├── MessageInput.jsx
│   ├── MessageList.jsx
│   ├── Navbar.jsx
│   └── RoomSidebar.jsx
├── pages/
│   ├── ChatPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── services/
│   └── api.js
├── styles/
│   ├── ChatBox.css
│   ├── LoginPage.css
│   ├── MessageInput.css
│   ├── MessageList.css
│   ├── RegisterPage.css
│   └── RoomSideBar.css
├── App.jsx
├── main.jsx
└── index.css
```

## Authentication Flow

Users register or log in through the frontend.

After a successful login, the backend returns a JWT token. The frontend stores the token in local storage:

```javascript
localStorage.setItem("jwt_token", token);
```

The token is later used for authenticated REST requests and WebSocket connections.

## API Configuration

The frontend uses an Axios instance in:

```text
src/services/api.js
```

Example:

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

export default api;
```

This keeps backend API calls centralized.

## WebSocket Flow

The chat page connects to the backend WebSocket endpoint:

```text
http://localhost:8080/ws
```

The JWT token is sent during the STOMP connection:

```javascript
stompClient.connect(
    {
        Authorization: `Bearer ${token}`
    },
    onConnect,
    onError
);
```

Users can join a room by entering a room ID. The frontend subscribes to:

```text
/topic/room/{roomId}
```

Messages are sent to:

```text
/app/yapper.send
```

The frontend sends only the room ID and message content. The backend controls the sender identity using the authenticated WebSocket principal.

Example outgoing message:

```json
{
  "roomId": 1,
  "content": "Hello"
}
```

## Running the Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Backend Requirement

The backend must be running on:

```text
http://localhost:8080
```

The backend must also allow CORS for:

```text
http://localhost:5173
```

## Current Status

Implemented:

* Register page
* Login page
* JWT token storage
* React Router setup
* Chat page layout
* Room sidebar
* Message input
* Message list
* STOMP WebSocket connection
* JWT sent during WebSocket connection

In progress:

* Realtime message display
* Room switching behavior
* Message history loading
* Final WebSocket message debugging
* UI polish

## Future Improvements

* Protected route wrapper
* Auth context
* Logout button
* Persistent room list
* Message timestamps
* Better error handling
* Loading states
* Typing indicators
* User profile display
* Deployment configuration
