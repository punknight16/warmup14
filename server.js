var http = require('http');
var fs = require('fs');

var data = {};
var update_needed = false;

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
}, 30000)


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
}).listen(3000)