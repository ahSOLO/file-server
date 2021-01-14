const net = require('net');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const server = net.createServer();

server.on('connection', (client) => {
  console.log('New client connected!');
  client.on('data', (filename) => {
    console.log('File Requested:', filename.toString())
    console.log("Sending Filename");
    client.write("_EXTNAME_" + path.extname(filename.toString()));
    const fileStream = fs.createReadStream(filename.toString());
    pipeline(
      fileStream,
      client,
      (err) => {
        if (err) {console.error(err)};
        console.log('File transfer done');
      }
    );
  });
});

server.listen(8888, () => {
  console.log('Server listening on port 8888!');
});