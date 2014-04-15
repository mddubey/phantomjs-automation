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

    var sendSMSLink = document.getElementById('send-sms');
    eventFireFn(sendSMSLink, 'click');

    setTimeout(promptForCode, 5000);
};