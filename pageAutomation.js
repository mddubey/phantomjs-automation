var wp = require('webpage');
var fs = require('fs');

var js_no_conflict = function(){
	jQuery.noConflict();	
	jQuery(document).ready(function(){jQuery('body').append('<pageisready/>');});
};
var js_has_JQuery = function(){
	return typeof jQuery == "function";
};

var js_has_element = function(selector,context){
	var elements = ( context && jQuery(selector,eval(context)) ) || jQuery(selector);
	return elements.length > 0;
};

var injectJQuery = function(p){
	fs.exists('jquery-1.10.2.min.js') || console.log('cant access jquery');
	p.injectJs('jquery-1.10.2.min.js');
	p.evaluate(js_no_conflict);
};

var ensure_page_has_jquery = function(p){	
	p.evaluate(js_has_JQuery) || injectJQuery(p);
};

var hooks = {onError:[],onAlert:[]};
exports.watch = function watch(h){
	h.onError && hooks.onError.push(h.onError);
	h.onAlert && hooks.onAlert.push(h.onAlert);
};

var invokeHook = function(hook){
	for(var i=0;i<hook.length;i++)
			setTimeout(hook[i],0);
};

//TODO: add recorder on page for alerts,errors,new window,close etc
var bindEvents = function(p){
	p.hasElement = function hasElement (selector,context){
		ensure_page_has_jquery(p);
		return p.evaluate(js_has_element,selector,context);
	};
	p.isReady = function(){
		return p.hasElement('pageisready');
	};
	p.alerts = [];
	p.onAlert = function onAlert(message){
		p.alerts.push(message);
		invokeHook(hooks.onAlert);		
	};
	p.errors = [];
	p.onError = function onError(msg,trace){
		var msgStack = ['PAGE('+p.title+','+p.url+')','ERROR: ' + msg];
	    if (trace) {
	        msgStack.push('TRACE:');
	        trace.forEach(function(t) {
	            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
	        });
	    }
	    p.errors.push(msgStack);
	    invokeHook(hooks.onError);
	};
	p.children = [];
	p.onPageCreated = function onPageCreated(newPage){
		p.children.push(newPage);
		bindEvents(newPage);
	};
};
exports.createPage = function createPage (url) {
	var page = wp.create();	
	bindEvents(page);
	page.open(url);
	return page;
};