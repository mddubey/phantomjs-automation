var infoCount = 1;
var errorCount = 1;
var pageCount = 1;
var fs = require('fs');

function setup() {
    fs.write('./logs/url.json', '', 'w');
    fs.write('./logs/pages.log', '', 'w');
    fs.write('./logs/messages.log', '', 'w');
    fs.write('./logs/errors.log', '', 'w');
}

setup();
exports.getDocumentDetails = function(document) {
    var details = {};
    details.title = document.title;
    details.url = window.location.href;
    details.content = document.getElementsByTagName('html')[0].outerHTML;
    return details;
}

exports.renderPageAsInfo = function(name) {
    var imageName = './screens/info/COUNT_NAME.png';
    imageName = imageName.replace('COUNT', infoCount++).replace('NAME', name);
    page.render(imageName);
}

exports.renderPageAsError = function(name) {
    var imageName = './screens/error/COUNT_NAME.png';
    imageName = imageName.replace('COUNT', errorCount++).replace('NAME', name);
    page.render(imageName);
}

exports.logMessage = function(message) {
    fs.write('./logs/messages.log', message + '\n', 'a');
};

exports.logError = function(err) {
    var message = "error on page:- " + err;
    fs.write('./logs/errors.log', message + '\n', 'a');
};

function getTime() {
    return new Date().toString().split(" ")[4]; //current system time
}

var storePageURL = function(pageDetails) {
    var log = 'Page {{TITLE}} opened with url {{PAGEURL}} at {{TIME}}\n';
    log = log.replace('TITLE', pageDetails.title).replace('PAGEURL', pageDetails.url).replace('TIME', getTime());
    var url = {};
    url[pageDetails.title] = pageDetails.url;
    fs.write('./logs/url.json', JSON.stringify(url) + '\n', 'a');
    fs.write('./logs/pages.log', log, 'a');
}

var storePageContent = function(pageDetails) {
    var path = './pages/COUNT_FILENAME.html';
    path = path.replace('FILENAME', pageDetails.title).replace('COUNT', pageCount++);
    path = path.replace(':', '-');
    fs.write(path, pageDetails.content, 'w');
}

exports.storePageDetails = function(pageDetails) {
    storePageContent(pageDetails);
    storePageURL(pageDetails);
}

exports.eventFire = function(el, etype) {
    if (el.fireEvent) {
        (el.fireEvent('on' + etype));
        return;
    }
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
};