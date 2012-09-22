var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require("../utils/utils");

function Foursquare (_conf) {
    this.config = {};
    
    if(_conf)
        this.config = _conf;
}

Foursquare.prototype.getOAuthUrl = function(req, res) {
    var serviceConf = this.config;
    var code = req.query.code;
    
    if(serviceConf && code) {
        var serverMode = (req.connection && req.connection.encrypted) ? "https" : "http";   
        return serviceConf.auth_url + "?client_id=" + serviceConf.client_id + "&client_secret=" + serviceConf.client_secret + "&redirect_uri=" + serverMode + "://" + req.headers.host + "/oauth/facebook" + "&code=" + code + "&grant_type=authorization_code";
    }
    
    return null;
}

Foursquare.prototype.getTokenFromResponse = function(res) {
    try {
        var data = JSON.parse(res);
        if(data.access_token) {
            return data.access_token;
        }
    } catch(e) {
        return "";
    }
}

Foursquare.prototype.getPositions = function(access_token, callback) {
    logger.info('Getting Foursquare positions...');
    var positions = [];

    if(access_token) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var response = JSON.parse(this.responseText);

                var checkins = response.response.recent;
                var users = [];

                for(var c = 0; c < checkins.length; c++) {
                    var ci = checkins[c];

                    var userid = ci.user.id;
                    if (ci.user.relationship == 'friend' &&
                        typeof users[userid] == 'undefined' &&
                        ci.venue &&
                        ci.venue.location) {
                        users[userid] = true;

                        positions.push({
                            userid: Utils.fullName(ci.user.firstName, ci.user.lastName),
                            lat: ci.venue.location.lat,
                            lon: ci.venue.location.lng,
                            time: ci.createdAt,
                            picture: ci.user.photo
                        });
                    }
                }

                logger.info("Foursquare positions retrieved!");
                callback(positions);
            }
        }

        var url = 'https://api.foursquare.com/v2/checkins/recent?oauth_token=' + access_token;

        xhr.open('GET', url);
        xhr.send();
    }
}

exports.service = Foursquare;
