var count = 1;
var firstTimeSignIn = true;
var system = require('system');
var evaluator = require('./evaluator');

function renderPageTo(name) {
    page.render('./screens/' + count++ + '_' + name + '.jpeg');
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

exports.performOperationOnPrompt = function(msg){
	system.stdout.writeLine(msg);
    var line = system.stdin.readLine();
    return line;
}

exports.performOperationOnConsoleMessage = function (msg) {
    var operations = {};
    operations['login'] = function(){
        renderPageTo('filledLoginForm');
    };

    operations['verify'] = function(){
        console.log('Verification code sent on your mobile');
        renderPageTo('afterCodeSent');
    };

    operations['code filled'] = function(){
        renderPageTo('afterCodeFilled');
    }

    var showConsoleMessage = function(msg){
        console.log(msg);
    }

    if(['login','verify','code filled'].indexOf(msg)>-1){
        operations[msg]();
        return;
    }
    showConsoleMessage('Message on Browser\'s console:-- '+msg);
};

exports.performOperationOnPageLoaded = function(args){
    return function () {
        if (page.title == 'ThoughtWorks - Sign In'){
            if(!firstTimeSignIn)
                return;
            console.log('opening login page');
            renderPageTo('login');
            page.evaluate(evaluator.onLoginPage, args);
        }

        if(page.title == 'ThoughtWorks - Extra Verification'){
            renderPageTo('verify');
            console.log('loaded Verification page');
            page.evaluate(evaluator.onVerificationPage, eventFire);
            return;
        }

        console.log(page.title);
        if(page.title == 'salesforce.com - Unlimited Edition'){
            renderPageTo('ourThoughtworksHome');
            console.log('Loading Our ThoughtWorks Page');
            phantom.exit();
        }
    
    }
};