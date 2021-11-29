# CS340 Final Project - Group 61
## Running
```
node app.js
```

## Architecture Overview
`app.js` setups routing and starts the server.
`backend/` contains code used by `app.js`
`frontend/` contains code served within the client webpage.

### Frontend responsibilities
The front end is responsible for:
- Aggregating user input data from forms
- Sending data to server
- Handling server response (update table or display error)

**Requirements:** *form id, server route, data keys/values, callback on server response*

### Backend responsibilities
The back end is responsible for:
- Routing client requests
- Input data validation
- Querying database
- Responding to client with HTML fragment or error

**Requirements:** *server route, expected data, SQL query, callback for return from database, send result to client*
