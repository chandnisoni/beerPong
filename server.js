var express = require('express');
var app = express();

var server = app.listen(8000, function(){
  console.log("server running on port 8000");
});

var io = require('socket.io').listen(server);
var path = require("path");
var fs = require('fs');

var five = require("johnny-five"),
  board, potentiometer;


app.use(express.static(path.join(__dirname, "./static")));

io.on('connection', function (socket) {
  console.log("Connected to user :" + socket.id);

  board = new five.Board();

  board.on("ready", function() {

    // Create a new `potentiometer` hardware instance.
    potentiometer = new five.Sensor({
      pin: "A0",
      freq:1000
    });

    // Inject the `sensor` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
      pot: potentiometer
    });
    var array = [];
    var initAvg = 0;
    // "data" get the current reading from the potentiometer
    potentiometer.on("data", function() {

      console.log(this.value);
      array.push(this.value);
      if(array.length > 5){
        array.shift();
      }else{
        initAvg = this.value;
      }

      var sum = 0;
      for(var i=0; i<array.length; i++){
        sum+= array[i];
      }
      var avg = sum/array.length;
      console.log('average'+ avg);
      socket.emit('avg', avg);

      if(avg < initAvg - 20){
        console.log('Scored!!');
        socket.emit('scored');
      }
      socket.on('server_response', function (avg){
        console.log('The server says: ' + avg.response);
      });

    });
  });
});
