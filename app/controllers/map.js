(function(){
    function updateScreen(e) {
        var elMap = $.friends_positions;
        var elButtons = $.buttons;
        var elSetup = $.setup;
        var elLogout = $.logout;
        var elLogo = $.minilogo;

        switch(e.orientation) {
            case Ti.UI.PORTRAIT:
                elMap.left = 0;
                elMap.bottom = 120;
                elButtons.height = 120;
                elButtons.width = Ti.UI.FILL;
                elButtons.layout = 'horizontal';
                elSetup.left = 45;
                elLogout.left = 10;
                elSetup.top = elLogout.top = 28;
                elLogo.top = 22;
                break;
                
            case Ti.UI.LANDSCAPE_LEFT:
            case Ti.UI.LANDSCAPE_RIGHT:
                elMap.left = 120;
                elMap.bottom = 0;
                elButtons.height = Ti.UI.FILL;
                elButtons.width = 120;
                elButtons.layout = 'vertical';
                elSetup.left = elLogout.left = 28;
                elSetup.top = elLogout.top = 10;
                elLogo.top = 0;
                break;
            
            case Ti.UI.FACE_UP:
                elButtons.width = 0;
                elButtons.height = 0;
                elMap.left = 0;
                elMap.bottom = 0;
                break;
        }
    }
    
    function updatePositions() {
        var xhr = Ti.Network.createHTTPClient({
            onload : function(e) {
                Ti.API.log('Got positions: ' + this.responseText);
                var positions = JSON.parse(this.responseText);
                
                var annotations = [];
                _.each(positions, function(pos) {
                    var args = {
                        title: pos.userid,
                        latitude: pos.lat,
                        longitude: pos.lon,
                        picture: pos.picture,
                        time: pos.time
                    };
    
                    annotations.push(Alloy.createController('annotation', args).getView());
                });
                
                $.friends_positions.setAnnotations(annotations);
            },
            // function called when an error occurs, including a timeout
            onerror : function(e) {
                Ti.API.debug(e.error);
                alert('Oops! There was a problem retrieving the positions! Try again in a few!');
            },
            timeout : 30000  // in milliseconds
        });
        // Prepare the connection.
        xhr.open("GET", Alloy.CFG.url + "/positions");
        // Send the request.
        xhr.send();
    }
    
    function setup() {
        var setupWin = Alloy.createController('setup').getView('SetupWindow');
        setupWin.open();
    }
    
    function logout() {
        var xhr = Ti.Network.createHTTPClient({
            onload : function(e) {
                $.MapWindow.close();
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
        xhr.open("GET", Alloy.CFG.url + "/logout");
        xhr.send();
    }
    
    $.logout.addEventListener('click', logout);
    $.setup.addEventListener('click', setup);
    $.minilogo.addEventListener('doubletap', updatePositions);
    Ti.Gesture.addEventListener('shake', updatePositions);
    Ti.Gesture.addEventListener('orientationchange', updateScreen);
    
    updateScreen({orientation: Ti.Gesture.orientation});
    updatePositions();
})();
