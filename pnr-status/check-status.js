var system = require('system');
var page = require('webpage').create();
var helper = require('../helper/helper');

var url = 'http://www.trainspnrstatus.com/';

var getPnrNo = function() {
	return system.args[1];
}

var defineLoadFinishedActions = function(){
	var actions = {};
	actions.formFilled = false;
	var formPageTitle = 'PNR Status: Railway PNR Status, Check PNR Status, IRCTC PNR Status, Get PNR Status';
	var resultPageTitle = 'Current Reservation Status of Your Railway Ticket';

	actions[formPageTitle] = function() {
		if(actions.formFilled) return;
		console.log('opening pnr-status form page');
		helper.renderPageAsInfo('pnr-status-form');
		var pageDetails = page.evaluate(fillForm, getPnrNo(), helper.getDocumentDetails);
		helper.storePageDetails(pageDetails);
		actions.formFilled = true;
	};

	actions[resultPageTitle] = function() {
		console.log('opening pnr-result page');
		helper.renderPageAsInfo('pnr-result');
		var pageDetails = page.evaluate(getStatus, helper.getDocumentDetails);
		helper.storePageDetails(pageDetails);
		phantom.exit();
	}
	return actions;
}

var fillForm = function(pnrNo, getDocumentDetails) {
	document.getElementById('fullname').value = pnrNo;
	document.getElementById('contact_form').submit();
	console.log('%Checking Status%');
	return getDocumentDetails(document);
};

var getStatus = function(getDocumentDetails) {
	var details = getDocumentDetails(document);
	return details;
};

page.onConsoleMessage = function(messgae) {
	var actions = {};
	actions['%Checking Status%'] = function() {
		helper.renderPageAsInfo('after-form-filled');
	};

	actions[messgae] && actions[messgae]();
	actions[messgae] || console.log("message on console:- ", messgae);
};

page.onError = function(err) {
	console.log("error on page:- ", err);
};

page.onLoadFinished = function(status) {
	loadFinishedActions[page.title] && loadFinishedActions[page.title]();
	loadFinishedActions[page.title] || console.log('title:-- ', page.title);
};

var loadFinishedActions = defineLoadFinishedActions();
page.open(url);