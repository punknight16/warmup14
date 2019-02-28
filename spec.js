var http = require('http');

var server = http.createServer(function(req, res){
	switch(req.url){
		case 'home':
			res.write('this route inspects the main business obj for the logged in user');
			res.end('end home');
			break;
		case 'progress':
			res.write('this route displays a dashboard view of the user when it is clicked from browse');
			res.write('it provides the sprints and metric charted by time of each sprint with blog view below');
			res.write('ADMIN has access to revenue, engagements, and badges of user from this view');
			res.end('user');
			break;
		case 'browse':
			res.write('this route displays a table-view that lists and sorts the main business obj of all users')
			res.write('it has a username, an objectname, and a metric related to how good the biz-obj is to sort by');
			res.write('for ADMINS the metric can be changed between revenue, hearts, and retention');
			res.end('browse');
			break;
		///END MAIN MENU
		///START ICON MENU
		case 'settings->profile':
			res.end('this provides a tool for demographic info and badges');
			break;
		//START HIDDEN ROUTES
		case 'analytics':
			res.write('this is a chart like progress, but it has view-cards underneath');
			res.write('this is going to be a clone of plausible with a MYSQL query bar up-top');
			res.end('analytics');
		case 'sprint':
			res.write('this route displays a third-party blog view of a sprint when it is clicked from browse');
			res.write('it provides the journal-articles, hearts received, and links to broadcast');
			res.end('user');
			break;
		case 'onboard':
			res.write('this route provides a set of forms for a new user to get started with the app');
			res.write('they will use the tools to list out their goals on a timer -> these will be added to progress');
			res.write('the will be asked to pick 5 of those goals');
			res.write('then they will be given the opportunity to write out a plan for each of those five (but they can skip at anytime)');
			res.end('end onboard->jump to home');
		default: 
			res.end('bad request');
	}
}).listen(3000, function(){
	console.log('server running on 3000');
})