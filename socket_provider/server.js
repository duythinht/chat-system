var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var util = require('util');

app.get('/', function(req, res){
  res.sendfile('index.html');
});


app.get('/send-test', function(req, res) {
  // Make a new redisClient for publisher
  var redisClient = redis.createClient();
  // Test send to user 123
  var channel = util.format('chat:user:%s', 123);
  redisClient.publish(channel, 'Hello world');

  res.end('DONE');
});

var chatChannel = io.of('/chat');

chatChannel.on('connection', function(socket){
  
  // Prepare redis client for subscribe to user channel
  var redisClient = redis.createClient();
  
  redisClient.on('subscribe', function(channel, count) {
    console.log('A client has been subscribed');
    socket.emit('message', {
      message: 'Connected and subscribed'
    });
  });
  
  redisClient.on('message', function(channel, message) {
    // Send message to client
    socket.emit('message', {
      message: message
    });
  });
  
  socket.on('authentication', function(access_token) {

    var userList = {
      theOne: 123,
      theTwo: 345,
      theThree: 567
    };
    
    var userId = userList[access_token];

    var channel = util.format('chat:user:%s', userId);
    redisClient.subscribe(channel);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
