var http = require('http');
var fs = require('fs');

var data = {};
var update_needed = false;

if(process.env.NODE_ENV=='dev'){
	console.log('running dev environment');
	fs.readFile(__dirname+'/data.json', 'utf8', function(err, loaded_data){
		console.log('err: ', err);
		data = JSON.parse(loaded_data);
		console.log('data loaded: ', data);
	});

	setInterval(function(){
		console.log('checking if data needs to be stored');
		if(update_needed){
			fs.writeFile(__dirname+'/data.json', JSON.stringify(data), 'utf8', function(err){
				update_needed = false;
				console.log('data stored');
			});		
		} else {
			console.log('no updates since data last stored');
		}
	}, 5000)
} else if (process.env.NODE_ENV=='prod'){
	console.log('running prod environment');
	var AWS = require("aws-sdk");
	var s3 = new AWS.S3({
		"region": "us-west-2",
		"accessKeyId": require('./_config/creds.js').aws_creds.Access_key_ID,
		"secretAccessKey": require('./_config/creds.js').aws_creds.Secret_access_key
	});

	var bucket = 'warmup14';

	var params = {
		Bucket: bucket,
		Key: 'data.json',
		ResponseContentEncoding: 'utf8'
	};
	s3.getObject(params, function(err, loaded_data) {
		if (err) console.log(err);
		if(loaded_data == null){
			//error here
			data = {};
		} else {
			data = JSON.parse(loaded_data.Body.toString());
			console.log('data var set: ', JSON.stringify(data));	
		}
	});

	setInterval(function(){
		console.log('checking if data needs to be stored');
		if(update_needed){
			var body_str = JSON.stringify(data);
			var params2 = {
				Body: body_str,
				Bucket: bucket,
				Key: 'data.json',
				ContentType: "String",
				ContentLength: body_str.length
			};
			s3.putObject(params2, function(err, stored_data) {
				if (err) console.log(err);
				update_needed = false;
				console.log('data stored: ', JSON.stringify(stored_data));
			});	
		} else {
			console.log('no updates since data last stored');
		}
	}, 1800000) //1800000 is 30 min
}






var server = http.createServer(function(req, res){
	console.log('received: ', req.method);
	switch(req.method){
		case 'GET':
			res.end(JSON.stringify(data.biz_data));
			break;
		case 'POST':
			update_needed = true;
			var post_str = '';
			req.setEncoding = 'utf8';
			req.on('data', function(chunk){
				post_str += chunk;
			});
			req.on('end', function(){
				var biz_id = 'b'+data.biz_data.length;
				var biz_obj = {biz_id: biz_id, body: post_str};
				data.biz_data.push(biz_obj);
				res.end('pushed biz_obj');
			});
			break;
		default: 
			res.end('bad request');
	}
}).listen(process.env.PORT || 3000, function(){
	console.log('should be running on PORT or 3000');
})