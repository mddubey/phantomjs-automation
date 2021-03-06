exports.onLoginPage = function (args, getDocumentDetails) {
    document.getElementById('user-signin').value = args[0];
    document.getElementById('pass-signin').value = args[1];
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

exports.onTimeCardsEntryPage = function(args, getDocumentDetails, eventFireFn){
    var copyFromPreviousWeekButNotHours = function(){
        document.getElementById('CFPWButton').click();
        console.log('CFPW');
        document.getElementById('tcPage:tcForm:copyPrevWeekOverlayPageBlock:configCopyHoursFromPrevWeek').checked = false;
        document.getElementById('tcPage:tcForm:copyPrevWeekOverlayPageBlock:prevWeekTravelInfo').checked = false;
        document.getElementById('tcPage:tcForm:copyPrevWeekOverlayPageBlock:configCopyLocationsFromPrevWeek').checked = false;
        document.getElementById('tcPage:tcForm:copyPrevWeekOverlayPageBlock:configCopyNotesFromPrevWeek').checked = false;
        document.getElementById('tcPage:tcForm:copyPrevWeekOverlayPageBlock:configCopyETCFromPrevWeek').checked = true;
        document.getElementById('tcPage:tcForm:copyPrevWeekOverlayPageBlock:configCopyMilestoneFromPrevWeek').checked = true;
        document.getElementById('tcPage:tcForm:copyPrevWeekOverlayPageBlock:configCopyPhaseFromPrevWeek').checked = true;
        document.getElementById('CFSOverlay_CFSButton').click();
    };
    copyFromPreviousWeekButNotHours();

    setTimeout(function(){
        console.log('copied');
        var timeFields = document.getElementsByClassName('hrInputText fakeSelectorClassForHrInput');
        for(i=0;i<7;i++){
            timeFields[i].focus();
            timeFields[i].value = args[i];
            timeFields[i].blur();
        };
        console.log('filledSheets');
        document.getElementById('submitTCButton').click();
        setTimeout(function(){
            console.log('submitted');
        },7000);
    },5000);
    return getDocumentDetails(document);
}
