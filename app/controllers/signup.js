(function() {
    function updateScreen(e) {
        var elIndex = $.SignupWindow;
        var elHeader = $.header;
        var elLogo = $.logo;
        var elBack = $.back;
        var elPassConfirm = $.passconfirm;
        var elPass = $.pass;
        var elConfirm = $.confirm;
        
        switch(e.orientation) {
            case Ti.UI.PORTRAIT:
                elIndex.layout = 'vertical';
                elHeader.width = Ti.UI.FILL;
                elHeader.height = 54;
                elLogo.image = '/logoh.png';
                elLogo.width = 190;
                elLogo.height = 54;
                elBack.left = elBack.top = 8;
                elPassConfirm.layout = 'vertical';
                elPass.width = elConfirm.width = Ti.UI.FILL;
                break;
                
            case Ti.UI.LANDSCAPE_LEFT:
            case Ti.UI.LANDSCAPE_RIGHT:
                elIndex.layout = 'horizontal';
                elHeader.width = 120;
                elHeader.height = Ti.UI.FILL;
                elLogo.image = '/logo.png';
                elLogo.height = Ti.UI.SIZE;
                elLogo.width = 120;
                elLogo.height = 75;
                elBack.top = 75;
                elBack.left = 44;
                elPassConfirm.layout = 'horizontal';   
                elPassConfirm.width = Ti.UI.FILL; 
                elPass.width = elConfirm.width = 160;
                break;
            
        }
    }
    
    function doSignup() {
        var xhr = Ti.Network.createHTTPClient({
            onload : function(e) {
                var response = JSON.parse(this.responseText);
                alert('Account created! You can now login!');
                $.SignupWindow.close();
            },
            onerror : function(e) {
                var response = JSON.parse(this.responseText);
                
                if(response && response.message) {
                    alert(response.message);
                }
            },
            timeout : 5000  // in milliseconds
        });
        // Prepare the connection.
        xhr.open("POST", Alloy.CFG.url + "/signup");
        var values = {
            user: $.user.value,
            pass: $.pass.value,
            confirm: $.confirm.value
        };
        xhr.send(JSON.stringify(values));
    }
    
    function closeSignup() {
        $.SignupWindow.close();
    }
    
    Ti.Gesture.addEventListener('orientationchange', updateScreen);
    
    $.signup.addEventListener('click', doSignup);
    $.user.addEventListener('return', doSignup);
    $.pass.addEventListener('return', doSignup);
    $.confirm.addEventListener('return', doSignup);
    $.back.addEventListener('click', closeSignup);
    
    updateScreen({orientation: Ti.Gesture.orientation})
    
    $.user.focus();
})();
