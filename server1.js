var five = require("johnny-five"),
  board, potentiometer;

board = new five.Board();

board.on("ready", function() {

  // Create a new `potentiometer` hardware instance.
  potentiometer = new five.Sensor({
    pin: "A0",
    freq: 500
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
    if(avg < initAvg -20){
      console.log('SCored!!');
    }

  });


});
