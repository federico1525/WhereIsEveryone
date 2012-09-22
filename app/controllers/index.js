(function() {
    function updateScreen(e) {
        var elIndex = $.index;
        var elHeader = $.header;
        var elLogo = $.logo;
        var elUserPass = $.userpass;
        var elUser = $.user;
        var elPass = $.pass;
        
        switch(e.orientation) {
            case Ti.UI.PORTRAIT:
                elIndex.layout = 'vertical';
                elHeader.width = Ti.UI.FILL;
                elHeader.height = 54;
                elLogo.image = '/logoh.png';
                elLogo.width = 190;
                elLogo.height = 54;
                elUserPass.layout = 'vertical';
                elUser.width = elPass.width = Ti.UI.FILL;
                break;
                
            case Ti.UI.LANDSCAPE_LEFT:
            case Ti.UI.LANDSCAPE_RIGHT:
                elIndex.layout = 'horizontal';
                elHeader.width = 120;
                elHeader.height = Ti.UI.FILL;
                elLogo.image = '/logo.png';
                elLogo.height = Ti.UI.SIZE;
                elLogo.width = 120;
                elLogo.height = 95;     
                elUserPass.layout = 'horizontal';    
                elUser.width = elPass.width = 160;
                break;
        }
    }
    
    function doLogin() {
        Ti.API.log('Doing login...');
        var xhr = Ti.Network.createHTTPClient({
            onload : function(e) {
                var response = JSON.parse(this.responseText);
                var mapWin = Alloy.createController('map').getView('MapWindow');
                mapWin.open();
            },
            onerror : function(e) {
                var response = JSON.parse(this.responseText);
                
                if(response && response.message) {
                    alert(response.message);
                } else {
                    alert("Oops! Something went wrong!");
                }
            },
            timeout : 30000  // in milliseconds
        });
        // Prepare the connection.
        xhr.open("POST", Alloy.CFG.url + "/login");
        var values = {
            user: $.user.value,
            pass: $.pass.value
        };
        xhr.send(JSON.stringify(values));
    }
    
    function openSignup() {
        var signupWin = Alloy.createController('signup').getView('SignupWindow');
        signupWin.open();
    }
    
    Ti.Gesture.addEventListener('orientationchange', updateScreen);
    
    $.login.addEventListener('click', doLogin);
    $.user.addEventListener('return', doLogin);
    $.pass.addEventListener('return', doLogin);
    $.signupLabel.addEventListener('click', openSignup);
    
    //updateScreen({orientation: Ti.Gesture.orientation});
    
    $.index.open();
    $.user.focus();
})();
