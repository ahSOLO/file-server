const net = require('net');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
let stream_in_progress = false;

const server = net.createServer();

server.on('connection', (client) => {
  console.log('New client connected!');
  client.setEncoding('utf8'); // interpret data as text
  client.on('data', (filename) => {
    console.log('File Requested:', filename)
    console.log("Sending Filename");
    client.write("_EXTNAME_" + path.extname(filename));
    if (stream_in_progress === false) {
      stream_in_progress = true;
      const fileStream = fs.createReadStream(filename);
      pipeline(
        fileStream,
        client,
        (err) => {
          if (err) {console.error(err)};
          console.log('File transfer done');
          stream_in_progress = false;
        }
      );
    }
    // fs.readFile(filename, (err, data) => {
    //   if (err) throw err;
    //   console.log("Sending File");
    //   client.write(data);
    // });
  });
});

server.listen(8888, () => {
  console.log('Server listening on port 8888!');
});