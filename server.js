const express = require('express');
const cors = require('cors');

const server = express();
const port = 1234;

server.use(express.json());
server.use(cors());

server.listen(port, () => {
    console.log('Server: Running on port', port);
});


module.exports = server;
