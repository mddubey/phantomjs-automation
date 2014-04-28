var infoCount = 1;
var errorCount = 1;
var pageCount = 1;
var fs = require('fs');
var firstTimeSignIn = true;
var system = require('system');
var evaluator = require('./evaluator');

function setup(){
    fs.write('./logs/url.json','','w');
    fs.write('./logs/pages.log','','w');
}

setup();
var getDocumentDetails = function(document){
    var details = {};
    details.title = document.title;
    details.url = window.location.href;
    details.content = document.getElementsByTagName('html')[0].outerHTML;
    return details;
}

function renderPageAsInfo(name) {
    var imageName = './screens/info/COUNT_NAME.png';
    imageName = imageName.replace('COUNT',infoCount++).replace('NAME',name);
    page.render(imageName);
}

function renderPageAsError(name){
    var imageName = './screens/error/COUNT_NAME.png';
    imageName = imageName.replace('COUNT',errorCount++).replace('NAME',name);
    page.render(imageName);
}

function getTime () {
    return new Date().toString().split(" ")[4]; //current system time
}

var storePageURL = function(pageDetails){
    var log = 'Page {{TITLE}} opened with url {{PAGEURL}} at {{TIME}}\n';
    log = log.replace('TITLE', pageDetails.title).replace('PAGEURL', pageDetails.url).replace('TIME', getTime());
    var url = {};
    url[pageDetails.title] = pageDetails.url;
    fs.write('./logs/url.json',JSON.stringify(url)+'\n','a');
    fs.write('./logs/pages.log',log,'a');
}

var storePageContent = function(pageDetails){
    var path = './pages/COUNT_FILENAME.html';
    path = path.replace('FILENAME',pageDetails.title).replace('COUNT',pageCount++);
    path = path.replace(':','-');
    fs.write(path,pageDetails.content,'w');
}

var storePageDetails = function(pageDetails){
    storePageContent(pageDetails);
    storePageURL(pageDetails);
}

var eventFire = function (el, etype) {
    if (el.fireEvent) {
        (el.fireEvent('on' + etype));
        return;
    }    
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
};

exports.performOperationOnConfirm = function(msg){
    if(msg == 'Submit timecards for approval? You will not be able to make changes once they are submitted.'){
        console.log('confirm on page:--',msg);
        renderPageAsInfo('clickedSubmit');
        return true;
    }
};

exports.performOperationOnError = function(error){
    console.log('Error occured '+error);
    renderPageAsError('error');
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
        renderPageAsInfo('filledLoginForm');
    };

    operations['verify'] = function(){
        console.log('Verification code sent on your mobile');
        renderPageAsInfo('afterCodeSent');
    };

    operations['code filled'] = function(){
        renderPageAsInfo('afterCodeFilled');
    };

    operations['CFPW'] = function(){
        renderPageAsInfo('proceedToCopyFromPreviousWeek');
    };

    operations['copied'] = function(){
        renderPageAsInfo('copiedFromPrevWeek');
    };

    operations['filledSheets'] = function(){
        renderPageAsInfo('filledTimeSheets');
    };

    operations['submitted'] = function(){
        renderPageAsInfo('submittedTimeCard');
        phantom.exit();
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
            renderPageAsInfo('login');
            var pageDetails = page.evaluate(evaluator.onLoginPage, args, getDocumentDetails);
            storePageDetails(pageDetails);
        };

        actions['ThoughtWorks - Extra Verification'] = function(){
            renderPageAsInfo('verify');
            console.log('loaded Verification page');
            var pageDetails = page.evaluate(evaluator.onVerificationPage, eventFire, getDocumentDetails);
            storePageDetails(pageDetails);
        };

        actions['salesforce.com - Unlimited Edition'] = function(){
            renderPageAsInfo('ourThoughtworksHome');
            console.log('Loading Our ThoughtWorks Page');
            var pageDetails = page.evaluate(evaluator.onOurThoughtworksHomePage, eventFire, getDocumentDetails);
            storePageDetails(pageDetails);
        };

        actions['Timecards: Home ~ salesforce.com - Unlimited Edition'] = function(){
            renderPageAsInfo('timecardsHome');
            console.log('loading Timecards Home Page');
            var pageDetails = page.evaluate(evaluator.onTimeCardsHomePage, getDocumentDetails);
            storePageDetails(pageDetails);
        }

        actions['Timecard Entry ~ salesforce.com - Unlimited Edition'] = function(){
            renderPageAsInfo('timecardsEntry');
            console.log('loading Timecard Entry Page');
            var pageDetails = page.evaluate(evaluator.onTimeCardsEntryPage, args[2], getDocumentDetails, eventFire);
            storePageDetails(pageDetails);
        }

        actions[page.title] && actions[page.title]();
        actions[page.title] || console.log('title:-- ',page.title);
    }
};