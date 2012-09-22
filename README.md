Where is Everyone
=================

"Where is everyone?" helps you to find your friends, by seeing them on a map. The app retrieves your friends position from all the social networks you have connected, and merges them in a single view.

The app is divided in two parts: server and client. The server part is made using Appcelerator Node.ACS, and is responsible for the connection with external social networks; it provides a set of APIs to signup and login into ACS, connect to the social networks and retrieve the positions of your friends. The client works on mobile phones, and provides a mobile user interface to interact with the server.

## Configure the Server
To setup the server:

1. Edit the package.json file and set appid, consumerKey and consumerSecret:

~~~
"appid": "[YOUR_APP_ID]",
"-consumerKey": "[YOUR_CONSUMER_KEY]",
"-consumerSecret": "[YOUR_CONSUMER_SECRET]"
~~~

2. Edit config.json and add the required information.
To do so, first of all, you will need to create an app on the social network you want to join (currently supported: Facebook and Foursquare); if you are unsure how to do that, please check out their documentation (usually at http://developer.[socialnetwork].com).

Once your apps are created, find the client ID and SECRET and add to the configuration; also, check out the URL of the app on Node.ACS (should be http://[YOUR_APP_ID].cloudservices.appcelerator.com) and add to the configuration as well:

~~~
{
    "acs": {
        "key": "[YOUR_ACS_KEY]",
        "secret": "[YOUR_ACS_SECRET]"
    },
    "active": [
        "foursquare",
        "facebook"
    ],
    "foursquare": {
        "client_id": "[FOURSQUARE_CLIENT_ID]",
        "client_secret": "[FOURSQUARE_SECRET]",
        "auth_url": "[FOURSQUARE_TOKEN_URL]"
    },
    "facebook": {
        "client_id": "[FACEBOOK_CLIENT_ID]",
        "client_secret": "[FACEBOOK_SECRET]",
        "auth_url": "[FACEBOOK_TOKEN_URL]"
    }
}
~~~


## Configure the Client
To configure the client, follow these steps.

1. Set the ACS keys in tiapp.xml:

~~~
<property name="acs-oauth-secret-production" type="string">[OAUTH_SECRET_PRODUCTION]</property>
<property name="acs-oauth-key-production" type="string">[OAUTH_KEY_PRODUCTION]</property>
<property name="acs-api-key-production" type="string">[ACS_API_KEY_PRODUCTION]</property>
<property name="acs-oauth-secret-development" type="string">[OAUTH_SECRET_DEVELOPMENT]</property>
<property name="acs-oauth-key-development" type="string">[OAUTH_KEY_DEVELOPMENT]</property>
<property name="acs-api-key-development" type="string">[ACS_API_KEY_DEVELOPMENT]</property>
~~~

2. Set the app guid in tiapp.xml and manifest:

~~~
<guid>[YOUR_APP_GUID]</guid>
~~~

~~~
guid:[YOUR_APP_GUID]
~~~

3. Edit app/config.json and set the correct parameters:

~~~
"global": {
   "url" : "[NODE_ACS_URL]",
   "auth" : {
       "foursquare" : "[FOURSQUARE_OAUTH_URL]",
       "facebook" : "[FACEBOOK_OAUTH_URL]"
   }
}
~~~