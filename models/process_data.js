var config = require('./config');
var emoji_strip = require('emoji-strip');
var twitter = config.twitter;
var aws_sqs = config.sqs;
var aws_sns = config.sns;
var queue_url = config.queue_url;
var util = require('util');
var natural_language_understanding = config.natural_language_understanding;
var consumer = require('sqs-consumer');
var Q = require('q');

// function for the removal of the url from the tweet data
function removeUrl(tweetString)
{
	return tweetString.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
}

// function for the removal of the emoji from the tweet data
function removeEmoji(tweetString)
{
	return emoji_strip(tweetString);
}

// function to push the data on the queue if the url is given 
// function push_on_queue(obj)
// {
// 	if(queue_url !== null && queue_url !== undefined)
// 	{
		// var sqs_params = {
		// 	MessageBody: JSON.stringify(obj),
		// 	QueueUrl: queue_url
		// };
// 		aws_sqs.sendMessage(sqs_params, function(err, data){
// 			if(err !== null)
// 			{
// 				console.log(util.inspect(err));
// 			}
// 			else
// 			{
// 			var sqs_app = consumer.create({
// 					queueUrl: queue_url,
// 					region: 'us-west-2',
// 					batchSize: 1,
// 					handleMessage: function (message, done) {
// 					var msgBody = JSON.parse(message.Body);
				
// 					// analysis
// 					var analysis_param = {
// 						'text': msgBody.message,
// 						'features': {
// 							'concepts':{
// 								limit:3
// 							},
// 							'sentiment':{}			
// 						}
// 					};
// 					natural_language_understanding.analyze(analysis_param, function(err, data){
// 						if(!err)
// 						{
// 							// console.log('the data collected from the watson api:' + JSON.stringify(data));
// 							console.log();
// 							msgBody["label"] = data.sentiment.document.label;
// 							msgBody["score"] = data.sentiment.document.score;
// 							console.log('the data after the adding of the label and score is:  '+JSON.stringify(msgBody));
// 							console.log();
// 							// the pushing of the object in the sns and getting it on the web server.
// 							var params = {
// 								Message: JSON.stringify(msgBody),
// 								TopicArn: 'arn:aws:sns:us-west-2:742216866808:demo_twit_trend'
// 							};
// 							aws_sns.publish(params, function(err, data){
// 								if(err != null)
// 								{
// 									console.log(util.inspect(err));
// 								}
// 								else
// 								{
// 									console.log("the message has been sent to the sns check the webserver");
// 								}
// 							});
// 						}
// 						else
// 						{
// 							console.log('error has occured'+err);
// 						}
// 					});
					
// 					return done();
// 					}
// 			});
				
// 			sqs_app.on('error', function (err) {
// 				console.log(err);
// 			});

// 			sqs_app.start();
// 		}
// 		});
// 	}
// }

// function that returns the promise for the sending into the queue
function return_promise_sending_message(obj)
{
	var defered = Q.defer();
	if(queue_url !== null && queue_url !== undefined)
	{
		var sqs_params = {
			MessageBody: JSON.stringify(obj),
			QueueUrl: queue_url
		};
		aws_sqs.sendMessage(sqs_params, function(err, data){
			if(err != null)
			{
				defered.resolve(data);
			}
			else
			{
				defered.reject(err);
			}
		});
		return defered.promise;
	}
}


// function to stream the tweets from the tweeter streaming api
function stream_twitter(){
	console.log('the stream of twitter has started');
	twitter.stream('statuses/sample',function(stream){
		stream.on('data',function(data){
			// new json data object to be formed whenever the tweet comes
			var obj;
			// applying some conditioning on the tweet data
			if(data.place !== null && data.place !== undefined && data.lang == 'en')
			{
				var lon = data.place.bounding_box.coordinates[0][0][0];
				var lat = data.place.bounding_box.coordinates[0][0][1];
				if((lat >= -90 && lat <= 90) && (lon >= -180 && lon<= 180))
				{
					// get id for the the twitter data
					var id = data.id;
					var removedUrl = removeUrl(data.text);
					var removedEmoji = removeEmoji(removedUrl);
					// object to push into the queue
					obj = {"id":id, "message" : removedEmoji, "location" : {"lat":lat ,"lon":lon}};
					// data being pushed is
					// code to push the objected on the queue
					console.log('The data before the pushing is: '+JSON.stringify(obj));
					// Q(return_promise_sending_message(obj)).then(function(res){
					// 	util.inspect(res);
					// }, function(err){
					// 	console.log("error has occured");
					// });				
				}
			}
		});

		stream.on('error',function(error){
			throw error;
		});
	});
}

module.exports.process_data = stream_twitter;