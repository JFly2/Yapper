# Yapper Frontend

The Yapper frontend is a React and Vite application that provides the user interface for authentication, room creation, room joining, joined-room navigation, room details, member management, message history, and real-time chat through STOMP/WebSockets.

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
* Storing JWTs in `sessionStorage`
* Sending authenticated REST requests
* Establishing an authenticated STOMP connection
* Creating rooms
* Joining rooms using room codes
* Loading the authenticated user's joined rooms
* Switching between joined rooms
* Loading protected room message history
* Subscribing to room-specific WebSocket topics
* Sending and displaying real-time messages
* Displaying timestamps and date dividers
* Styling the authenticated user's messages separately
* Displaying owner/member room actions
* Showing room details and room members
* Allowing owners to kick members
* Allowing owners to delete rooms
* Allowing members to leave rooms
* Logging the user out

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

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

After successful registration, the user is redirected to the login page.

### Login Page

The login page collects:

* Username
* Password

It sends the login request to:

```http
POST /api/auth/login
```

After a successful login, the JWT and username are stored in `sessionStorage`:

```javascript
sessionStorage.setItem("jwt_token", token);
sessionStorage.setItem("username", username);
```

The user is then redirected to the chat interface.

Using `sessionStorage` allows different browser tabs to be logged in as different users during development, which makes owner/member testing easier.

### Chat Page

The chat page contains the main room and messaging interface.

It supports:

* WebSocket connection status
* Creating rooms
* Joining rooms by code
* Loading joined rooms
* Switching between joined rooms
* Loading message history
* Receiving messages in real time
* Sending messages
* Opening the room details sidebar
* Viewing room members
* Owner-only member kicking
* Owner-only room deletion
* Member room leaving
* Logging out

## Main Components

### `ChatBox`

Controls the main chat behavior, including:

* Establishing the STOMP connection
* Managing the active room
* Loading joined rooms
* Creating rooms
* Joining rooms by code
* Subscribing and unsubscribing from room topics
* Loading message history
* Sending messages
* Receiving live messages
* Loading room members
* Handling owner/member room actions

### `RoomSidebar`

Displays joined rooms and allows the user to:

* Enter a room join code
* Join a room
* Create a new room
* Select an existing joined room
* Collapse or expand the sidebar
* Log out

Joined rooms are loaded from the backend, so the joined-room list persists after refresh.

### `CreateRoomForm`

Provides the form for creating new rooms.

It supports:

* Room name input
* Optional category input
* Public/private room setting
* Room creation through the backend
* Returning the created room with its join code
* Copying the room join code

### `RoomDetailsSidebar`

Displays information and actions for the active room.

It supports:

* Room name
* User role in the room
* Room join code
* Room member list
* Owner/member role display
* Owner-only kick buttons
* Owner-only delete room button
* Member leave room button

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

## Room Flow

### Creating a Room

When a user creates a room:

1. The frontend sends a request to `POST /api/rooms`.
2. The backend creates the room and assigns the user the `OWNER` role.
3. The new room is added to the joined-room sidebar.
4. The new room becomes the active room.
5. The room's join code can be copied and shared.

### Joining a Room

When a user joins a room by code:

1. The frontend sends a request to `POST /api/rooms/code/{joinCode}`.
2. The backend creates a `MEMBER` membership for the user.
3. The room is added to the joined-room sidebar.
4. The room becomes the active room.
5. Stored message history is loaded.
6. The frontend subscribes to the room's WebSocket topic.

### Switching Rooms

When the user switches rooms:

1. The active room is updated.
2. Stored message history is loaded for the selected room.
3. The previous WebSocket subscription is removed.
4. The frontend subscribes to the new room's topic.
5. The room details sidebar updates to match the active room.

## Role-Based UI

Yapper displays different room actions depending on the authenticated user's role in the active room.

### OWNER

Owners can:

* Send and receive messages
* View room members
* Kick members
* Delete the room

### MEMBER

Members can:

* Send and receive messages
* View room members
* Leave the room

Members do not see owner-only controls.

The backend still enforces all permissions, even when the frontend hides unauthorized actions.

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
* Styled authentication UI
* JWT storage in `sessionStorage`
* Authenticated API requests
* Authenticated STOMP connections
* Protected chat route
* Chat interface
* Room creation form
* Joining rooms by code
* Loading joined rooms from the backend
* Room switching
* Joined-room sidebar
* Collapsible sidebar
* Message history loading
* Sending real-time messages
* Receiving real-time messages
* Message timestamps
* Date dividers
* Separate styling for the authenticated user's messages
* Room details sidebar
* Room member list
* Owner/member role-aware controls
* Owner kicking members
* Owner deleting rooms
* Members leaving rooms
* Logout

## Future Development

Possible future frontend features:

* Friends system UI
* Friend requests
* Direct message interface
* Friend-based room invitations
* Online/offline presence indicators
* Room moderator controls
* Room renaming UI
* Message editing and deletion
* Typing indicators
* Read receipts
* User profile pages
* Public room discovery
* Room category browsing
* Improved connection and reconnection handling
* Production deployment configuration
