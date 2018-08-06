# verado-chat
Test project for chatting between seller and buyer.

### Used technologies:
- angular 4
- socket.io
- angular material

### Components:
- start page, to enter the chat or create it
- chat page, to chat with partner

### Features:
- chat realised on sockets
- both users in chat can send offer message, with setting amount and price
- access to chat by token, each request verifying by token
- modals with angular animation and transition

### Backend
- storing users, chats, messages in variables, not any database
- separate events for client and server sending messages
- validations, tested for errors

