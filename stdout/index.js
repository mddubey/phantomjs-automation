var page = require('webpage').create();
var system = require('system');
var count = 1;

function renderPageTo(page, name) {
    page.render('./screens/' + count++ + '_' + name + '.jpeg');
}

page.onConsoleMessage=function(){
    renderPageTo(page,'afterFill');
}

page.onPrompt = function(msg){
    system.stdout.writeLine(msg);
    var line = system.stdin.readLine();
    return line;
}

page.open('https://www.facebook.com/', function () {
    renderPageTo(page, 'login');
    var title = page.evaluate(function () {
        document.getElementById('email').value = 'mkdskd';
        console.log('some');
        document.getElementById('u_0_n').click();
        return document.title;
    });
    console.log(title);
    phantom.exit();
});