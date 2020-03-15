module.paths.push('/usr/local/lib/node_modules');

var nodemailer = require("nodemailer");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serialport = require('serialport');
var exec = require('child_process').exec;
var SerialPort = serialport.SerialPort;
var serial;

//When a request come into the server for / give the client the file index.html
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.use("/font-awesome", express.static(__dirname + '/font-awesome'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: "email@domain.com",
    pass: "pass-word"
  }
});

app.get('/send',function(req,res){
  var mailOptions={
    to : req.query.to,
    subject : req.query.subject,
    text : req.query.text
  };
  console.log("Request received --->");
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
      res.end("error");
    }else{
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
});

//Listen for incoming connections
http.listen(8000, function() {
    console.log("listening on port 8000");
});

//When the serial port is successfully opened...
var onSerialOpen = function() {
    console.log("opened serial port");
    //When we get data from the serial port...
    serial.on('data', function(data) {
        console.log("Photon Serial Data : ", data);
        //Send to the browser; 'data' is the name of the event
        io.emit('to browser', data);
    });
};

//Here's what happens when a connection is made from the browser
io.sockets.on('connection',
    function(socket) {
        console.log("someone connected");
        //Since the socket is open, we can now accept "to serial" messages
        // from the browser
        socket.on('to serial', function(data) {
            if (serial && serial.isOpen()) {
                serial.write(data + '\n');
                console.log("Send '" + data + "' to serial");
            } else
                console.log("Serial port not open");
        });
    });

exec('particle serial list', function(error, stdout, stderr) {
    var devName = stdout.split('\n')[1].split(' - ')[0];
    console.log(devName);

    //Hook up the serial port
    serial = new SerialPort(devName, {
        parser: serialport.parsers.readline('\n')
    });
    //When the serial port is successfully opened...
    serial.on('open', onSerialOpen);
});
