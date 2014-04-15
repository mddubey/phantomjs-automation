var system = require('system');
var page = require('webpage').create();
var scripts = require('./scripts');

var args = system.args;

page.onLoadFinished = scripts.performOperationOnPageLoaded(args);

page.onConsoleMessage = scripts.performOperationOnConsoleMessage;

page.onPrompt = scripts.performOperationOnPrompt;


var url = 'http://our.thoughtworks.com/';
page.open(url);