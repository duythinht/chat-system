var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/users/:userId/messages', (req, res) => {
  var redisClient = redis.createClient();
  var channel = `chat:user:${req.params.userId}`;
  redisClient.publish(channel, JSON.stringify(req.body));
  res.send({status: 'ok'});
});

app.post('/rooms', (req, res) => {
  var redisClient = redis.createClient();
  redisClient.incr('chat:system:id', (err, systemId) => {
    var roomSubscribeKey = `chat:room:${systemId}`;
    for (var userId of req.body.users) {
      redisClient.sadd(roomSubscribeKey, userId);
    }
    res.send({room_id: systemId, users: req.body.users});
  });
});

app.post('/rooms/:roomId/messages', (req, res) => {
  //Should handle to get current user here
  var currentUserId = 456;

  //Do send message
  var redisClient = redis.createClient();
  var roomSubscribeKey = `chat:room:${req.params.roomId}`;
  redisClient.smembers(roomSubscribeKey, (err, users) => {
    for (var userId of users) {
      if (userId != currentUserId) {
        var channel = `chat:user:${userId}`;
        redisClient.publish(channel, JSON.stringify(req.body));
      }
    }
    res.send({'status': 'ok'});
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
