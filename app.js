// variable declaration for getting the express and route module
var express = require('express');
var route = require('./routes');
// the code get the data from the websocket
var web_socket = require('ws').Server;


var server_web_sockets = new web_socket({port: 8081});

// the body parser for the parsing of the json objects
var body_parser = require('body-parser');
// var router = express.Router();
var app = express();

var port = process.env.PORT || 3000;

app.use(body_parser.urlencoded({
    extended: true
}));

app.use(body_parser.json());

// to specify our static content is in public
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// setting the view engine as ejs
app.set('view engine','ejs');

// setting home for the site to be home
app.get('/', route.home);


app.get("/search:match_text?", route.postHome);

app.post("/subscribe", route.subscribe);

// listening on the port 3000
app.listen(port, function(){
	console.log("app has started to listen on the port" + port);
});

// // message type is
// msgType = req.headers['x-amz-sns-message-type'];
// if(msgType == 'SubscriptionConfirmation')
// {

//         var params = {
//                 Token: req.body.Token,
//                 TopicArn: req.body.TopicArn,
//                 AuthenticateOnUnsubscribe:"true"
//         }
//         aws_sns.confirmSubscription(params, function(err, data){
//                 if(err !== null)
//                 {
//                         console.log(util.inspect(err));
//                 }
//                 else
//                 {
//                         console.log('the data is :'+ JSON.stringify(data));
//                 }
//         });
// }
// else if(msgType == 'Notification')
// {
//         console.log('Notification has been sent to the endpoint by the sns');
//         console.log('the body of the req object is: '+JSON.stringify(req.body));
// }