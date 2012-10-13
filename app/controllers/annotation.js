var APP = require('core');

var args = arguments[0] || {};
$.annotation.title = args.title;
$.annotation.latitude = args.latitude;
$.annotation.longitude = args.longitude;

// get the time passed since the check in
var delta = parseInt((new Date()).getTime() / 1000) - args.time;
$.annotation.subtitle = prettyTime(delta);
$.annotation.image = pinImage(delta);

// get user's picture
$.annotation.leftView = Ti.UI.createImageView({
    image: args.picture,
    width: 32,
    height: 32
});

$.annotation.rightView = Ti.UI.createImageView({
    image: '/drive.png',
    width: 32,
    height: 32
});

$.annotation.rightView.addEventListener('click', function(e) {
    APP.NaviBridge.addPOI({
        lat: args.latitude,
        lon: args.longitude
    });
});

function prettyTime(delta) {
    if(delta < 60)
        return "A few seconds ago";
    if(delta < 90)
        return "One minute ago";
    else if(delta < 3600)
        return Math.round(delta/60) + " minutes ago";
    else if(delta < 5400)
        return "One hour ago";
    else if(delta < 86400)
        return Math.round(delta/3600) + " hours ago";
    else if(delta < 129600)
        return "Yesterday";
    else if(delta < 2592000)
        return Math.round(delta/86400) + " days ago";
    else if(delta < 3888000)
        return "Last month";
    else if(delta < 31104000)
        return Math.round(delta/2592000) + " months ago"
    else if(delta < 46656000)
        return "Last year";
    else
        return "Once upon a time";
}

function pinImage(delta) {
    // set the color of the pin, based on the time
    var pinimage;
    if(delta <  43200) // up to 6h ago
        pinimage = 5;
    else if(delta < 86400) // up to 24h ago
        pinimage = 4;
    else if(delta < 604800) // up to 7d ago
        pinimage = 3;
    else if(delta < 2592000) // up to 1m ago
        pinimage = 2;
    else
        pinimage = 1; // old ones
        
    return '/pin' + pinimage + '.png';
}


