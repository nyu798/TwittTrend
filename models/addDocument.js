var config = require('./config');
// var elastic_client = config.elastic_client;

// aws instance
// var elasticsearch_client_aws = config.elasticsearch_client_aws; 


function add_document(obj, obj_index, obj_type){
	elastic_client.index({
		index: obj_index,
		type: obj_type,
		body: obj
	}, function (error, response) {
	if(error)
	{
		console.log("Some error has occured while creating");
	}
  	else
  	{
  		console.log("all is well");
  	}
  });
}

module.exports.add_document = add_document;