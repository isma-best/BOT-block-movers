    //
    // By Nabil Mhaili
    //
var request = require('request');
var access_token ='EAAH6aZA9TyzMBACRRr5tctzVB7dpMfqEf6IwfYA2xqUfxU9csmI7ZCgjSpVRK9SIhemeY92zqv71w7Ku0K3p0JvM4ZBXjSZC7CPX4yJhnyConUQYEZBXQTagWa4Q2mnDwY0J0Djb5u0Uo39ADYK9XUYrzkPJdPG1lO1EdHmiNHa3ey6gphWuAWi2SCRzA0ZBwZD';

module.exports = function(app) {
    //
    // GET /bot
    //
    app.get('/bot', function(request, response) {
        if (request.query['hub.mode'] === 'subscribe' && 
            request.query['hub.verify_token'] === 'VTBLOCKMOVERS') {            
            console.log("Validating webhook");
            response.status(200).send(request.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            response.sendStatus(403);          
        }  
    });

    //
    // POST /bot
    //
    app.post('/bot', function(request, response) {
       var data = request.body;
       console.log('received bot webhook');

        // Make sure this is a page subscription
        if (data.object === 'page') {
            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function(entry) {
               var pageID = entry.id;
               var timeOfEvent = entry.time;
                // Iterate over each messaging event
                entry.messaging.forEach(function(event) {
                    if (event.message) {
						console.log('Message Event');
                        receivedMessage(event);
                    } else if (event.game_play) {
						console.log('Game play Event');
                        receivedGameplay(event);
                    } else {
                       // console.log("Webhook received unknown event: ", event);
                    }
                });
            });
        }
        response.sendStatus(200);
    });

    //
    // Handle messages sent by player directly to the game bot here
    //
    function receivedMessage(event) {

    }

    //
    // Handle game_play (when player closes game) events here. 
    //
    function receivedGameplay(event) {
        // Page-scoped ID of the bot user
        var senderId = event.sender.id; 
        // FBInstant player ID
        var playerId = event.game_play.player_id; 
        // FBInstant context ID 
        var contextId = event.game_play.context_id;

        sendMessage(senderId, null, '💥Thanks for playing!😋Come back❤️anytime', "Play NOW!", null,'https://cdn.ycan.shop/stores/harry-shop/products/ecr2QbDok8DkmgY054bsVuYFCwSOyJlxi6J5y3du.png');
        
    }

    //
    // Send bot message
    //
    // player (string) : Page-scoped ID of the message recipient
    // context (string): FBInstant context ID. Opens the bot message in a specific context
    // message (string): Message text
    // cta (string): Button text
    // payload (object): Custom data that will be sent to game session
    // 
    function sendMessage(player, context, message, cta, payload,imageUrl) {
		
        var button = {
            type: "game_play",
            title: cta
        };

        if (context) {
            button.context = context;
        }
        if (payload) {
            button.payload = JSON.stringify(payload)
        }
        var messageData = {
            recipient: {
                id: player
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                        {
                            title: message,
							image_url:imageUrl,
                            buttons: [button]
                        }
                        ]
                    }
                }
            }
        };

        callSendAPI(messageData);

    }
	
	function sendMessageNoImage(player, context, message, cta, payload) {
		
        var button = {
            type: "game_play",
            title: cta
        };

        if (context) {
            button.context = context;
        }
        if (payload) {
            button.payload = JSON.stringify(payload)
        }
        var messageData = {
            recipient: {
                id: player
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                        {
                            title: message,
                            buttons: [button]
                        }
                        ]
                    }
                }
            }
        };

        callSendAPI(messageData);

    }

    function callSendAPI(messageData) {
        var graphApiUrl = 'https://graph.facebook.com/me/messages?access_token='+access_token;
        request({
            url: graphApiUrl,
            method: "POST",
            json: true,  
            body: messageData
        }, function (error, response, body){
            console.error('send api returned', 'error', error, 'status code', response.statusCode, 'body', body);
        });
    }

}

    //
    // By Nabil Mhaili
    //