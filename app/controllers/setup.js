(function() {
    function updateScreen(e) {
        var elIndex = $.SetupWindow;
        var elHeader = $.header;
        var elLogo = $.logo;
        var elButtons = $.setupcnt;
        var elBack = $.back;
        var elInfo = $.info;
        
        switch(e.orientation) {
            case Ti.UI.PORTRAIT:
                elIndex.layout = 'vertical';
                elHeader.width = Ti.UI.FILL;
                elHeader.height = 54;
                elLogo.image = '/logoh.png';
                elLogo.width = 190;
                elLogo.height = 54;
                elButtons.layout = 'horizontal';
                elButtons.width = Ti.UI.FILL;
                elButtons.height = 48;
                elBack.top = elBack.left = 8;
                elInfo.text = "Click on the social network icon above to connect!";
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
                elButtons.layout = 'vertical';
                elButtons.width = 48;
                elButtons.height = Ti.UI.FILL;
                elBack.top = 75;
                elBack.left = 44;
                elInfo.text = "Click on the social network icon on the left to connect!";
                break;
            
        }
    }
    
    function authorize(service) {
        if(Alloy.CFG.auth[service]) {
            $.authorize.url = Alloy.CFG.auth[service];
        }
    }
    
    Ti.Gesture.addEventListener('orientationchange', updateScreen);
    
    $.foursquare.addEventListener('click', function() {
        authorize('foursquare');
    });
    
    $.facebook.addEventListener('click', function() {
        authorize('facebook');
    });
    
    $.back.addEventListener('click', function() {
        $.SetupWindow.close();
    });
    
    updateScreen({orientation: Ti.Gesture.orientation});
})();
