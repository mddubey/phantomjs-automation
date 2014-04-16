exports.onLoginPage = function (args, getDocumentDetails) {
    document.getElementById('user-signin').value = args[1];
    document.getElementById('pass-signin').value = args[2];
    document.getElementById('remember').checked = true;
    document.getElementById('credentials').submit();
    console.log('login');
    return getDocumentDetails(document);
};

exports.onVerificationPage = function (eventFireFn, getDocumentDetails) {
    var promptForCode = function(){
        console.log('verify');
        var verificationCode = prompt('VFCD');
        document.getElementById('smsFactorAttempt.code').value = verificationCode;
        console.log('code filled');
        document.getElementById('verify_factor').click();    
    };

    var sendSMSLink = document.getElementById('send-sms');
    eventFireFn(sendSMSLink, 'click');

    setTimeout(promptForCode, 5000);
    return getDocumentDetails(document);
};

exports.onOurThoughtworksHomePage = function(eventFireFn, getDocumentDetails){
    var timeCardLink = document.getElementsByTagName('a')[10];
    eventFireFn(timeCardLink,'click');
    return getDocumentDetails(document);
}

exports.onTimeCardsHomePage = function(getDocumentDetails){
    document.getElementsByClassName('btn')[1].click();
    return getDocumentDetails(document);
}

exports.onTimeCardsEntryPage = function(getDocumentDetails){
    return getDocumentDetails(document);
}

