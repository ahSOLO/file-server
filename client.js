const net = require('net');
const fs = require('fs');
const { pipeline } = require('stream'); 
const readline = require('readline');

let stream_in_progress = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const conn = net.createConnection({ 
  host: 'localhost', // change to IP address of computer or ngrok host if tunneling
  port: 8888 // or change to the ngrok port if tunneling
});

conn.setEncoding('utf8'); // interpret data as text

conn.on('data', (data) => {
  let filename = "";
  if (data.slice(0, 9) === "_EXTNAME_") {
    filename = "clientFile" + data.slice(9)
    console.log("Filename Set");
  }
  if (filename && !stream_in_progress) {
    stream_in_progress = true;
    const fileStream = fs.createWriteStream(filename);
    pipeline(
      conn,
      fileStream,
      (err) => {
        if (err) {console.error(err)};
        console.log('File received');
        stream_in_progress = false;
      },
    )
  }
  // if (filename) {
  //   fs.writeFile(filename, data, (err) => {
  //     if (err) throw err;
  //   });
  // }
});

conn.on('connect', () => {
  console.log('Successfully connected to server');
  rl.question("Please enter the name of the file you are requesting:\n", (answer) => {
    conn.write(answer);
    rl.close();
  });
});
  
conn.on('error', (err) => {
  console.log("Error");
  console.log(err.stack);
});