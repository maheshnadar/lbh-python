// $(document).ready(function () {
//     var datahistory = $('#datahistory').text();
//     // console.log(history)
//     // var datahistory = JSON.parse(datahistory);

//     console.log(typeof (datahistory), datahistory)
//     //   var datahistory = JSON.parse(datahistory)
//     console.log((datahistory))
//     if (datahistory != "") {
//         var add_tab_html = '<p id = "agentname" hidden="True">' +
//             datahistory['user2'] + '</p>'
//         $('#chathide').append(add_tab_html)
//         // newhist = datahistory['contexts']
//         insertChat("you", datahistory['secondmessage'], 0);
//         insertChat("me", datahistory['thirdmessage'], 0);
//         // console.log(newhist)
//         console.log(datahistory)
//     }
//     console.log("ready!");
// });

var socket = io.connect('http://' + document.domain + ':' + 8095);

// var private_socket = io.connect('http://127.0.0.1:5000/private');
var private_socket = io.connect('http://' + document.domain + ':' + 8095+'/private');
console.log('http://' + document.domain + ':' + location.port+'/private');


function scrollbottom(){
    setTimeout(function(){
        $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
    },500);
}

// $('#send_private_message').on('click', function (e) {
//     // var recipient = $('#send_to_username').val();
//     // console.log("dev");

//     var message_to_send = $('#private_message').val();
//     // console.log(message_to_send)
//     // var username = $('#username').text();
//     // var agent = $('#agentname').text();
//     console.log(agent);
//     console.log("#####");
//     if (agent == "None") {
//         console.log("#####");


//         private_socket.emit('private_message', {
//             "type": "user",
//             "username": username,
//             "useremail": useremail,
//             "message": message_to_send
//         });
//     } else {

//         private_socket.emit('second_private_message', {
//             "type": "user",
//             "username": username,
//             "message": message_to_send,
//             "agentname": agent
//         })

//     }
//     // console.log(username);

//     // console.log(e.which);
//     // if (e.which == 1) {
//     //   var text = $(".mytext").val();
//     //   if (text !== "") {
//     //     insertChat("you", text);
//     //     $(".mytext").val('');
//     //   }
//     // }
// });

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}



//-- No use time. It is a javaScript effect.
// function insertChat(who, text, time) {
//     if (time === undefined) {
//         time = 0;
//     }
//     var control = "";
//     var date = formatAMPM(new Date());

//     if (who == "me") {
//         control = '<li style="width:100%">' +
//             '<div class="msj macro">' +
//             '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + me.avatar + '" /></div>' +
//             '<div class="text text-l">' +
//             '<p>' + text + '</p>' +
//             '<p><small>' + date + '</small></p>' +
//             '</div>' +
//             '</div>' +
//             '</li>';
//     } else {
//         control = '<li style="width:100%;">' +
//             '<div class="msj-rta macro">' +
//             '<div class="text text-r">' +
//             '<p>' + text + '</p>' +
//             '<p><small>' + date + '</small></p>' +
//             '</div>' +
//             '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' +
//             you.avatar + '" /></div>' +
//             '</li>';
//     }
//     setTimeout(
//         function () {
//             $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
//         }, time);

// }

// function resetChat() {
//     $("ul").empty();
// }

// $(".mytext").on("keydown", function (e) {
//     if (e.which == 13) {
//         var text = $(this).val();
//         if (text !== "") {
//             insertChat("you", text);
//             $(this).val('');
//         }
//     }
// });

// $('body > div > div > div:nth-child(2) > span').click(function () {
//     $(".mytext").trigger({
//         type: 'keydown',
//         which: 13,
//         keyCode: 13
//     });
// })

//-- Clear Chat
// resetChat();

//-- Print Messages
// var username = $('#username').text();
// insertChat("me", "Hi " + username + "! Welcome to Ross-Simons live chat support. What can we help you with?", 0);
// insertChat("you", "Hi, Pablo", 1500);
// insertChat("me", "What would you like to talk about today?", 3500);
// insertChat("you", "Tell me a joke", 7000);
// insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
// insertChat("you", "LOL", 12000);

var app = angular.module("chatWindow", []);

app.controller('chatWindowController', function ($scope) {
    $scope.privateMessage = {};
    $scope.privateMessage.message = "";
    $scope.agentDisconnected = false;
    $scope.chatOpen = true;
    $scope.chatHistory = [];
    // console.log("chat list ",chathistory, chathistory.chatlist.length)
    if (chathistory == null || chathistory.chatlist.length == 0) {
        console.log("chathistory null")
        $scope.chatHistory.chatlist = [{
            date: new Date(),
            from_id: useremail,
            fromname: username,
            msg: "Hi " + username + ", Welcome to Ross-Simons live chat support. What can we help you with?",
            to_id: "",
            toname: "",
            type: "agent"
        }]
        console.log("chathistory null 2", $scope.chatHistory)
    } else {
        $scope.chatHistory = chathistory;
        // console.log("chathistory null 3",$scope.chatHistory);
        console.log("chathistory null 3", chathistory, agent);
        agent = chathistory.user2;
        console.log("chathistory null 3", chathistory, agent);
    }


    $scope.user = username;
    $scope.sendPrivateMessage = function (message) {
        if ($scope.privateMessage.message !== "") {
            if (agent == "None") {
                console.log("#####");
                private_socket.emit('private_message', {
                    "date": new Date(),
                    "from_id": useremail,
                    "fromname": username,
                    "message": message,
                    "to_id": "none",
                    "toname": "none",
                    "type": "user",
                    "agent_email": "",
                    "user_email": useremail,
                    "user_details": {
                        "url": window.location.href,
                        "browser": window.navigator.userAgent
                    }
                });
            } else {
                private_socket.emit('second_private_message', {
                    "type": "user",
                    // "username": username,
                    // "message": message,
                    // "agentname": agent
                    "date": new Date(),
                    "from_id": useremail,
                    "fromname": username,
                    "to_id": "none",
                    "message": message,
                    "toname": 'agent',
                    "type": "user",
                    "agent_email": agent,
                    "user_email": useremail,
                    "user_details": {
                        "url": window.location.href,
                        "browser": window.navigator.userAgent
                    }

                })
            }
        }
        $scope.privateMessage.message = "";
        console.log('input', $scope.privateMessage.message);
    }

    $scope.sendViaEnter = function ($event, message) {
        var keycode = $event.which || $event.keycode;
        if (keycode === 13) {
            $scope.sendPrivateMessage(message);
        }
        console.log(keycode);
    }


    // verify our websocket connection is established
    private_socket.on('connect', function () {
        console.log('Websocket connected! on private');
        socket.emit('disconnected');
    });
    socket.on('disconnect', function () {
        console.log('Websocket connected!');
        socket.emit('disconnected');
    });

    private_socket.on('new_private_message', function (msg) {
        var username = $('#username').text();
        // console.log("new private message",msg);
        // agent = msg.to_id;
        console.log('new_private_message', msg, agent, username);
        if (msg.fromname == username || msg.toname == username) {
            console.log('new_private_message');
            // var add_tab_html = '<p id = "agentname" hidden="True">' +
            //     msg['agentname'] + '</p>'
            // $('#chathide').append(add_tab_html)
            // data={{data | tojson}};
            console.log(msg);
            agent = msg.agent_email;
            console.log($scope.chatHistory, "chat history");
            $scope.chatHistory.chatlist.push(msg);
            // insertChat("you", msg['message']);
            // insertChat("me", "hi i am  " + msg['agent'] + "    how can i help you");
        }
        $scope.$digest();
    });
    private_socket.on('user_ongoing_chat', function (msg) {
        console.log("user_ongoing_chat", msg);
        scrollbottom();
        var username = $('#username').text();
        // if (msg.username == username) {
        //     insertChat("you", msg['message']);
        if (msg.fromname == username || msg.toname == username) {
            console.log('new_private_message');
            // var add_tab_html = '<p id = "agentname" hidden="True">' +
            //     msg['agentname'] + '</p>'
            // $('#chathide').append(add_tab_html)
            // data={{data | tojson}};
            console.log(msg);
            agent = msg.agent_email;
            console.log($scope.chatHistory, "chat history");
            $scope.chatHistory.chatlist.push(msg);
            // insertChat("you", msg['message']);
            // insertChat("me", "hi i am  " + msg['agent'] + "    how can i help you");
        }
        if(msg.from_id == msg.agent_email){
            notifyMe();
            // console.log("Getting in");
        }

        var fullMsg = msg.msg;
        console.log(fullMsg);

    // ---------------------- Notification Code ----------------------

    Notification.requestPermission().then(function(result) {
        console.log(result);
    });
    function notifyMe() {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }
  
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(msg.from_id, {body:msg.msg});
            setTimeout(notification.close.bind(notification), 5000);
        }
  
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(msg.from_id, {body:msg.msg});
                    setTimeout(notification.close.bind(notification), 5000);
                }
            });
        }
  
        // Finally, if the user has denied notifications and you 
        // want to be respectful there is no need to bother them any more.
    }

    // ---------------------- End Notification Code ----------------------







        $scope.$digest();
        // }
    });    

    


    private_socket.on('offline_message', function (endUser) {
        console.log('offline message !', endUser);
        // window.location.href = "http://stackoverflow.com";
        

         if(endUser.username==username){
            window.location.href = 'off';
        }

        // socket.emit('Connection');
    });

    private_socket.on('agent_end_chat', function (endUser) {
        //to end chat

        console.log("inside user end chat", endUser);

        if(endUser.username==username){
            $scope.agentDisconnected =true;
        }

        // console.log(msg);

        $scope.$digest();

    });
    $scope.likeSuggest = function () {
        console.log("likeClicked");
        private_socket.emit('like_suggest', {
            "type": "user",
            // "username": username,
            // "message": message,
            // "agentname": agent
            "date": new Date(),
            "from_id": useremail,
            "fromname": username,
            "to_id": "none",
            "message": "none",
            "toname": 'agent',
            "type": "user",
            "agent_email": agent,
            "user_email": useremail,
            "user_details": {
                "url": window.location.href,
                "browser": window.navigator.userAgent
            }
        });
    }

    $scope.dislikeSuggest = function () {
        console.log("dislikeClicked");
        private_socket.emit('dislike_suggest', {
            "type": "user",
            // "username": username,
            // "message": message,
            // "agentname": agent
            "date": new Date(),
            "from_id": useremail,
            "fromname": username,
            "to_id": "none",
            "message": "none",
            "toname": 'agent',
            "type": "user",
            "agent_email": agent,
            "user_email": useremail,
            "user_details": {
                "url": window.location.href,
                "browser": window.navigator.userAgent
            }
        });
    }

})