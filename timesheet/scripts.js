var infoCount = 1;
var errorCount = 1;
var pageCount = 1;
var fs = require('fs');
var firstTimeSignIn = true;
var system = require('system');
var evaluator = require('./evaluator');

// function setup(){
//     fs.write('./logs/url.json','','w');
//     fs.write('./logs/log','','w');
// }

// setup();
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

// var storeURL = function(pageDetails){
//     var log = 'Page TITLE with url PAGEURL opened at TIME';
//     log = log.replace('TITLE', pageDetails.title).replace('PAGEURL', pageDetails.url).replace('TIME', getTime());
//     var url = {pageDetails.title:pageDetails.url};
//     fs.write('./logs/url.json',JSON.stringify(url),'a');
//     fs.write('./logs/log',log,'a');
//     console.log('likha');
// }

var storePageContent = function(pageDetails){
    var path = './pages/COUNT_FILENAME.html';
    path = path.replace('FILENAME',pageDetails.title).replace('COUNT',pageCount++);
    fs.write(path,pageDetails.content,'w');
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

exports.performOperationOnError = function(error){
    console.log('Error occured '+error);
    renderPageAsError('error');
};

exports.performOperationOnError = function(msg){
    console.log('Alert on page '+msg);
};

exports.performOperationOnPrompt = function(msg){
    if(msg == 'VFCD'){
        system.stdout.writeLine('Enter verification code sent on your mobile:--');
        var line = system.stdin.readLine();
        return line;
    }
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

    var showConsoleMessage = function(){
        console.log('Message on Browser\'s console:-- '+msg);
    };

    operations[msg] && operations[msg]();
    operations[msg] || showConsoleMessage();
};

exports.performOperationOnPageLoaded = function(args){
    console.log('mai yaha')
    return function () {
        var actions = {};

        actions['ThoughtWorks - Sign In'] = function(){
            if(!firstTimeSignIn)
                return;
            console.log('opening login page');
            renderPageAsInfo('login');
            var pageDetails = page.evaluate(evaluator.onLoginPage, args, getDocumentDetails);
            storePageContent(pageDetails);
            // storePageUrl(pageDetails);
        };

        actions['ThoughtWorks - Extra Verification'] = function(){
            renderPageAsInfo('verify');
            console.log('loaded Verification page');
            var pageDetails = page.evaluate(evaluator.onVerificationPage, eventFire, getDocumentDetails);
            storePageContent(pageDetails);
        };

        actions['salesforce.com - Unlimited Edition'] = function(){
            renderPageAsInfo('ourThoughtworksHome');
            console.log('Loading Our ThoughtWorks Page');
            var pageDetails = page.evaluate(evaluator.onOurThoughtworksHomePage, eventFire, getDocumentDetails);
            storePageContent(pageDetails);
            phantom.exit();
        };

        actions[page.title] && actions[page.title]();
        actions[page.title] || console.log('title',page.title);
    }
};