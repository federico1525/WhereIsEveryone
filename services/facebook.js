var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require("../utils/utils");

function Facebook (_conf) {
    this.config = {};
    
    if(_conf)
        this.config = _conf;
}

Facebook.prototype.getOAuthUrl = function(req, res) {
    var serviceConf = this.config;
    var code = req.query.code;
    
    if(serviceConf && code) {
        var serverMode = (req.connection && req.connection.encrypted) ? "https" : "http";   
        return serviceConf.auth_url + "?client_id=" + serviceConf.client_id + "&client_secret=" + serviceConf.client_secret + "&redirect_uri=" + serverMode + "://" + req.headers.host + "/oauth/facebook" + "&code=" + code;
    }
    
    return null;
}

Facebook.prototype.getTokenFromResponse = function(res) {
    try {
        if(res.indexOf('access_token=') == 0) {
            return res.replace('access_token=', '');
        }
    } catch(e) {
        return "";
    }
    
    return "";
}

Facebook.prototype.getPositions = function(access_token, callback) {
    logger.info('Getting facebook positions...');
    
    var fql = 'SELECT coords, author_uid, timestamp FROM location_post WHERE author_uid IN (SELECT uid2 FROM friend WHERE uid1=me()) ORDER BY timestamp DESC LIMIT 100';
    
    var positions = [];

    if(access_token) {
        this.getFriends(access_token, function(friends) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    var response = JSON.parse(this.responseText);

                    var locations = response.data;
                    var users = [];

                    for(var l = 0; l < locations.length; l++) {
                        var loc = locations[l];

                        var userid = loc.author_uid;
                        var picture = null;
                        for(var ff = 0; ff < friends.length; ff++) {
                            if(friends[ff].id == loc.author_uid) {
                                userid = Utils.fullName(friends[ff].first_name + ' ' + friends[ff].last_name);
                                if(friends[ff].picture && friends[ff].picture.data && friends[ff].picture.data.url)
                                    picture = friends[ff].picture.data.url;

                                break;
                            }
                        }
                        if (users[userid] == undefined) {
                            users[userid] = true;

                            positions.push({
                                userid: userid,
                                lat: loc.coords.latitude,
                                lon: loc.coords.longitude,
                                time: loc.timestamp,
                                picture: picture
                            });
                        }
                    }

                    logger.info("Facebook positions retrieved!");
                    callback(positions);
                }
            }

            var url = 'https://graph.facebook.com/fql?q=' + fql + '&oauth_token=' + access_token;

            xhr.open('GET', url);
            xhr.send();
        });
    }
}

Facebook.prototype.getFriends = function(access_token, callback) {
    var friends = [];
    if(access_token) {
        logger.info('Getting Facebook friends...');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var response = JSON.parse(this.responseText);

                if(response && response.friends) {
                    friends = response.friends.data;
                }

                callback(friends);
            }
        }

        var url = 'https://graph.facebook.com/me?fields=friends.fields(id,first_name,last_name,picture)&oauth_token=' + access_token;
        xhr.open('GET', url);
        xhr.send();
    }
}

exports.service = Facebook;
