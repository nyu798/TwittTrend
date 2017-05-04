// code to put the data into the elasticsearch by the help of the promises
var config = require('./config');
var elasticsearch_client_aws = config.elasticsearch_client_aws;


function put_data(object)
{
	console.log('the code to put the data into the elasticsearch has started');
	obj_index = 'twitter';
	obj_type = 'tweet';
	elasticsearch_client_aws.index({
		index: obj_index,
		type: obj_type,
		body: object
	}, function (error, response) {
	if(error)
	{
		console.log("Some error has occured while creating");
	}
  	else
  	{
  		console.log("all is well the data has been sent to the elasticsearch");
  	}
  });

}

module.exports.put_data = put_data;