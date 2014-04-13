var system = require('system');
var page = require('webpage').create();
var scripts = require('./scripts');

var args = system.args;

page.onLoadFinished = scripts.performOperationOnPageLoaded;

page.onConsoleMessage = scripts.performOperationOnConsoleMessage;

page.onPrompt = scripts.performOperationOnPrompt;


var url = 'http://thoughtworks.okta.com';
page.open(url, scripts.performOperationOnPageOpen(args));