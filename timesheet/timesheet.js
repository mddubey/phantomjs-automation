var system = require('system');
var page = require('webpage').create();
var scripts = require('./scripts');

var getUserInput = function(){
	var args = [];
	args[0] = system.args[1];
	args[1] = system.args[2];
	try{
		args[2] = JSON.parse(system.args[3]);
	}
	catch(err){
		console.log('\nFill Proper Times for all 7 days\nUsase:- sh timesheet.sh [8,8,8,8,8,0,0]');
		phantom.exit();
	}
	if(!args[2] || args[2].length < 7){
		console.log('\nFill Proper Times for all 7 days\nUsase:- sh timesheet.sh [8,8,8,8,8,0,0]');
		phantom.exit();
	}
	return args;
}

var args = getUserInput();

page.onLoadFinished = scripts.performOperationOnPageLoaded(args);

page.onConsoleMessage = scripts.performOperationOnConsoleMessage;

page.onPrompt = scripts.performOperationOnPrompt;

page.onError = scripts.performOperationOnError;

page.onAlert = scripts.performOperationOnAlert;


var url = 'http://our.thoughtworks.com/';

page.open(url);