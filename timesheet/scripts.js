var firstTimeSignIn = true;
var system = require('system');
var evaluator = require('./evaluator');
var myLib = require('../helper/helper');

exports.performOperationOnConfirm = function(msg){
    if(msg == 'Submit timecards for approval? You will not be able to make changes once they are submitted.'){
        console.log('confirm on page:--',msg);
        myLib.renderPageAsInfo('clickedSubmit');
        return true;
    }
};

exports.performOperationOnError = function(error){
    console.log('Error occured '+error);
    myLib.renderPageAsError('error');
};

exports.performOperationOnAlert = function(msg){
    console.log('Alert on page '+msg);
};

exports.performOperationOnPrompt = function(msg){
    if(msg == 'VFCD'){
        system.stdout.writeLine('Enter verification code sent on your mobile:--');
        var line = system.stdin.readLine();
        return line;
    }
    console.log('prompt on browser',msg);
};

exports.performOperationOnConsoleMessage = function (msg) {
    var operations = {};
    operations['login'] = function(){
        myLib.renderPageAsInfo('filledLoginForm');
    };

    operations['verify'] = function(){
        console.log('Verification code sent on your mobile');
        myLib.renderPageAsInfo('afterCodeSent');
    };

    operations['code filled'] = function(){
        myLib.renderPageAsInfo('afterCodeFilled');
    };

    operations['CFPW'] = function(){
        myLib.renderPageAsInfo('proceedToCopyFromPreviousWeek');
    };

    operations['copied'] = function(){
        myLib.renderPageAsInfo('copiedFromPrevWeek');
    };

    operations['filledSheets'] = function(){
        myLib.renderPageAsInfo('filledTimeSheets');
        phantom.exit();
    };

    operations['submitted'] = function(){
        myLib.renderPageAsInfo('submittedTimeCard');
    };

    var showConsoleMessage = function(){
        console.log('Message on Browser\'s console:-- '+msg);
    };

    operations[msg] && operations[msg]();
    operations[msg] || showConsoleMessage();
};

exports.performOperationOnPageLoaded = function(args){
    return function () {
        var actions = {};

        actions['ThoughtWorks - Sign In'] = function(){
            if(!firstTimeSignIn)
                return;
            console.log('opening login page');
            myLib.renderPageAsInfo('login');
            var pageDetails = page.evaluate(evaluator.onLoginPage, args, myLib.getDocumentDetails);
            myLib.storePageDetails(pageDetails);
        };

        actions['ThoughtWorks - Extra Verification'] = function(){
            myLib.renderPageAsInfo('verify');
            console.log('loaded Verification page');
            var pageDetails = page.evaluate(evaluator.onVerificationPage, myLib.eventFire, myLib.getDocumentDetails);
            myLib.storePageDetails(pageDetails);
        };

        actions['salesforce.com - Unlimited Edition'] = function(){
            myLib.renderPageAsInfo('ourThoughtworksHome');
            console.log('Loading Our ThoughtWorks Page');
            var pageDetails = page.evaluate(evaluator.onOurThoughtworksHomePage, myLib.eventFire, myLib.getDocumentDetails);
            myLib.storePageDetails(pageDetails);
        };

        actions['Timecards: Home ~ salesforce.com - Unlimited Edition'] = function(){
            myLib.renderPageAsInfo('timecardsHome');
            console.log('loading Timecards Home Page');
            var pageDetails = page.evaluate(evaluator.onTimeCardsHomePage, myLib.getDocumentDetails);
            myLib.storePageDetails(pageDetails);
        }

        actions['Timecard Entry ~ salesforce.com - Unlimited Edition'] = function(){
            myLib.renderPageAsInfo('timecardsEntry');
            console.log('loading Timecard Entry Page');
            var pageDetails = page.evaluate(evaluator.onTimeCardsEntryPage, args[2], myLib.getDocumentDetails, myLib.eventFire);
            myLib.storePageDetails(pageDetails);
        }

        actions[page.title] && actions[page.title]();
        actions[page.title] || console.log('title:-- ',page.title);
    }
};