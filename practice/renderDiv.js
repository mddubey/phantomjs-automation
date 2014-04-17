var system = require('system');
var page = require('webpage').create();

page.onCallback = function(data){
	page.clipRect = {
                top:    data.top,
                left:   data.left,
                width:  data.width,
                height: data.height
            };

            page.render('./screens/form.png');
            console.log('rendering div');
            phantom.exit();
}

page.onLoadFinished = function () {
	console.log(page.title);
	console.log('opening home page');
	page.render('./screens/home.png');
	page.evaluate(function(){
		var divBounds = document.getElementById('reg_form_box').getBoundingClientRect();
		window.callPhantom(divBounds);
	})
	phantom.exit();
}

page.open('https://www.facebook.com/');