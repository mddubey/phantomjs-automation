exports.onLoginPage = function (args) {
    document.getElementById('user-signin').value = args[1];
    document.getElementById('pass-signin').value = args[2];
    document.getElementById('remember').checked = true;
    document.getElementById('credentials').submit();
    console.log('login');
};

exports.onVerificationPage = function (eventFireFn) {
    var promptForCode = function(){
        console.log('verify');

        var verificationCode = prompt('Enter verification code sent on your mobile:--');
        document.getElementById('smsFactorAttempt.code').value = verificationCode;
        console.log('code filled');
        document.getElementById('verify_factor').click();    
    };

    if (document.title == 'ThoughtWorks - Sign In')
        return;
    var sendSMSLink = document.getElementById('send-sms');
    eventFireFn(sendSMSLink, 'click');

    setTimeout(promptForCode, 5000);
};

exports.onApplicationsPage = function(eventFireFn){
    var ourThoughtWorksLink = document.getElementById('0oag3qwdj7CTZRQVGUKO_mc');
    return ourThoughtWorksLink.href;
};
