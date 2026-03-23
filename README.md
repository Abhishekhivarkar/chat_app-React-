# Realtime Group Chat Application

A realtime group chat application built with **React, Node.js, Express, and Socket.IO** that allows users to communicate instantly through WebSockets.

## Features

* Real-time messaging using WebSockets
* Group chat room system
* Username based chat identity
* Instant message broadcasting
* Toast notifications when users join
* Message timestamps
* Responsive chat UI
* Send messages using Enter key
* Clean WhatsApp-like chat interface

## Tech Stack

Frontend:

* React
* Vite
* Tailwind CSS
* Socket.IO Client

Backend:

* Node.js
* Express.js
* Socket.IO

## How It Works

1. User enters their name to join the chat.
2. The client establishes a WebSocket connection with the server.
3. The server places the user into a shared chat room.
4. When a user sends a message:

   * The message is sent to the server.
   * The server broadcasts it to all other users.
5. All connected clients receive the message instantly.

## Installation

Clone the repository

```
git clone https://github.com/Abhishekhivarkar/chat_app-React-.git
```

Install dependencies

Backend:

```
npm install
```

Frontend:

```
npm install
```

## Run the project

Start backend:

```
npm start
```

Start frontend:

```
npm run dev
```

## Project Architecture

Client → WebSocket → Server → Broadcast → All Clients

The server manages message distribution and room communication while the client handles UI rendering and message interaction.

## Future Improvements

* Private chat rooms
* Typing indicators
* Message persistence (database)
* Online user list
* Authentication system
* Message reactions

## Author

Abhishek Hivarkar
