var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/users/:userId/messages', (req, res) => {
  var redisClient = redis.createClient();
  var channel = `chat:user:${req.params.userId`;
  redisClient.publish(channel, JSON.stringify(req.body));
  res.send({status: 'ok'});
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
