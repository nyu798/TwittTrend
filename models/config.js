// twitter instance
var twit = require('twitter');

// the initialization for the amazon aws
var elasticsearch = require('elasticsearch');
var http_aws_es = require('http-aws-es');
//To analyze the sentiment of tweets
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var aws = require('aws-sdk');
aws.config.update({
	accessKeyId: '#############', 
	secretAccessKey: '#############'
});

// credentials for the twitter 
var twitter = new twit({
  consumer_key: '#############',
  consumer_secret: '#############',
  access_token_key: '#############',
  access_token_secret: '#############'
});

//credentials for the aws elasticsearch
var elasticsearch_client_aws = elasticsearch.Client( { 
  hosts: 'search-my-first-tweet-map-goizzcdxue2ghq3pauuiuxzfz4.us-west-2.es.amazonaws.com',
  connectionClass: http_aws_es,
  log: 'trace',
  amazonES: {
    region: 'us-west-2',
    accessKey: '#############',
	secretKey: '#############'
  }
});

var sqs = new aws.SQS();

var sns = new aws.SNS();

//To analyze the sentiment of tweets
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '#############',   
  'password':  '#############',   
  'version_date': '2017-02-27'
});

//analyze sentiments
module.exports.natural_language_understanding = natural_language_understanding;
module.exports.twitter = twitter;
module.exports.elasticsearch_client_aws = elasticsearch_client_aws;
module.exports.aws = aws;
module.exports.sns = sns;
module.exports.sqs = sqs;
