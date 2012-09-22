var CONFIG = require('nconf');
var URL = require('url');
var SERVICES = [];
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

CONFIG.use('file', {
    file: __dirname + '/config.json'
});
CONFIG.load();

var _acsKey = CONFIG.get("acs:key");
var _acsSecret = CONFIG.get("acs:secret");

if(!_acsKey || !_acsSecret) {
    throw new Error("Configuration parameters missing: ACS key/secret! " + JSON.stringify(CONFIG));
}

ACS.init(_acsKey, _acsSecret);

var _activeServices = CONFIG.get("active");
var ACTIVE_SERVICES = [];
for (var _ss in _activeServices) {
    var _serviceName = _activeServices[_ss];
    try {
        var _serviceModule = new (require("./services/" + _serviceName).service)(CONFIG.get(_serviceName));

        SERVICES[_serviceName] = _serviceModule;
        ACTIVE_SERVICES.push(_serviceName);

        logger.info("Loaded service " + _serviceName);

    } catch(e) {
       logger.error("Cannot load service file for " + _serviceName);
    }
}
 
api.index = function(req, res) {
    ACS.Users.showMe(function(data) {
		if(data.success) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end("{message: 'Welcome back " + data.users[0].username + "'}");
		} else {
			res.writeHead(401, {'Content-Type': 'application/json'});
			res.end("{message: 'You better login, dude!'}");
		}
	}, req, res);
};

api.login = function(req, res) {
	console.log('Logging in...');

	var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        try {
        	var data = JSON.parse(body);

        	var user = data.user;
        	var pass = data.pass;

           	if(!user || !pass) {
    			res.writeHead(400, {'Content-Type': 'application/json'});
    	        res.end('{"message": "Oops! Missing username and/or password!"}');
    		} else {
    		    ACS.Users.login({login: user, password: pass}, function(data) {
    		    	if(data.success) {
    		    		res.writeHead(200, {'Content-Type': 'application/json'});
    		        	res.end('{"message": "User logged in!"}');
    		        } else {
    		        	res.writeHead(401, {'Content-Type': 'application/json'});
    		        	res.end('{"message": "Oops! Login failed, check credentials!"}');
    		        }
    		    }, req, res);
    		}
        } catch(e) {
            res.writeHead(401, {'Content-Type': 'application/json'});
            res.end('{"message": "Oops! Login failed, check credentials!"}');
        }
    });
}

api.logout = function(req, res) {
	logger.info('Logging out...');
	ACS.Users.logout(null, function(data) {
    	if(data.success) {
    		res.writeHead(200, {'Content-Type': 'application/json'});
        	res.end('{"message": "See you next time!"}');
        } else {
        	res.writeHead(500, {'Content-Type': 'application/json'});
        	res.end('{"message": "Oops! Logout failed for some reason!"}');
        }
    }, req, res);
}

api.signup = function(req, res) {
	console.log('Signing up...');

	var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
    	var data = JSON.parse(body);

    	var user = data.user;
    	var pass = data.pass;
    	var confirm = data.confirm;

       	if(!user || !pass || !confirm) {
			res.writeHead(400, {'Content-Type': 'application/json'});
	        res.end('{"message": "Oops! Missing username and/or password!"}');
		} else if(pass != confirm) {
			res.writeHead(400, {'Content-Type': 'application/json'});
	    	res.end('{"message": "Oops! Signup failed, passwords mismatch!"}');
		} else {
		    ACS.Users.create({
			    username: user,
			    password: pass,
			    password_confirmation: confirm
			}, function (e) {
			    if (e.success) {
			    	res.writeHead(200, {'Content-Type': 'application/json'});
			        res.end('{"message": "User ' + user + ' created!"}');
			    } else {
			    	res.writeHead(401, {'Content-Type': 'application/json'});
			        res.end('{"message": "Oops! Signup failed, check username and/or password!"}');
			    }
			});
		}
    });
}

api.oauth = function(req, res) {
    var reqUrl = URL.parse(req.url);
    var path = (reqUrl && reqUrl.pathname) ? reqUrl.pathname.split("/") : [];
    var service = null;
    for(var p = 0; p < path.length; p++) {
        if(path[p] == "oauth" && path[p+1]) {
            service = path[p+1];
            break;
        }
    }

    if(service && SERVICES[service]) {
        logger.info('Calling ' + service + ' login');

        var url = SERVICES[service].getOAuthUrl(req, res);
        if(url) {
        	var xhr = new XMLHttpRequest();
        	xhr.onreadystatechange = function() {
        	    if (this.readyState == 4) {
        	    	var access_token = SERVICES[service].getTokenFromResponse(this.responseText);
        	    	if(access_token != null) {
        	    		// save the access token on ACS
        	    		ACS.KeyValues.set({
        	    			name: service + '_token',
        	    			value: access_token,
        	    			access_private: true
        	    		}, function(data) {
        	    			if(data.success) {
        	    				res.end(service + ' is connected!');
        	    			} else {
        	    				res.end('Oops, something went wrong!');
        	    		    }
        	    	    }, req, res);
        	    	}
        	    }
        	}

            xhr.open('GET', url);
            xhr.send();
        } else {
            console.log("Service " + service + " is not properly configured!");
            res.end("Oops! At this moment you cannot connect to " + service + ". Try again later!");
        }
    } else {
        console.log("Service " + service + " is not active!");
        res.end("Oops! At this moment you cannot connect to " + service + ". Try again later!");
    }
}

api.positions = function(req, res) {
	var counter = 0;
	for(var service in SERVICES) {
		counter++;
	}

	logger.info('Services: ' + counter);
	var access_tokens = [];

	// get tokens

	logger.info('Getting tokens...');

	for(var service in SERVICES) {
		logger.info('Getting token for ' + service);
		ACS.KeyValues.get({
			name: service + '_token',
			access_private: true
		}, function(data) {
			counter--;
			if(data.success && data.keyvalues && data.keyvalues[0]) {
				var service = data.keyvalues[0].name.replace('_token', '');
				access_tokens[service] = data.keyvalues[0].value;
				logger.info('Got ' + service + ' Access Token');
			}

			logger.info('Counter: ' + counter);
			if(counter <= 0) {
				getPositions(access_tokens, res);
			}
		}, req, res);
	}
}

function getPositions(access_tokens, res) {
	var counter = 0;
	for(var service in SERVICES) {
	    counter++;
	}

	logger.info("Getting positions for " + counter + " services...");

	var positions = [];
    for(var service in SERVICES) {
        if(!access_tokens[service]) {
            logger.error("No access token for " + service);
            counter--;
        } else {
            SERVICES[service].getPositions(access_tokens[service], function(service_positions) {
                counter--;

                if(service_positions.length) {
                    positions = positions.concat(service_positions);
                }

                if(counter <= 0)
                    printJSON(res, positions);
            });
        }
    }

	if(counter <= 0) {
		printJSON(res, positions);
	}
}

function printJSON(res, json) {
	logger.info('Printing JSON');
	res.text(JSON.stringify(json));
}
