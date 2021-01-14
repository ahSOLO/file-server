const net = require('net');
const fs = require('fs');
const { pipeline } = require('stream'); 
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const conn = net.createConnection({ 
  host: 'localhost',
  port: 8888
});

conn.on('data', (data) => {
  let filename = "";
  if (data.toString().slice(0, 9) === "_EXTNAME_") {
    filename = "clientFile" + data.toString().slice(9)
    console.log("Filename Set");
  }
  if (filename) {
    const fileStream = fs.createWriteStream(filename);
    pipeline(
      conn,
      fileStream,
      (err) => {
        if (err) {console.error(err)};
        console.log('File received');
      },
    )
  }
});

conn.on('connect', () => {
  console.log('Successfully connected to server');
  rl.question("Please enter the name of the file you are requesting:\n", (answer) => {
    conn.write(answer.toString());
    rl.close();
  });
});
  
conn.on('error', (err) => {
  console.log("Error");
  console.log(err.stack);
});