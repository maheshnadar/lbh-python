// var url="http://127.0.0.1:5000/";
var url='http://' + document.domain + ':' + location.port+'/';
console.log(url);

var socket = io.connect('http://' + document.domain + ':' + location.port);




// url="http://192.168.0.175:5000/";
var socket = io.connect(url);
// verify our websocket connection is established
socket.on('connect', function () {
    console.log('Websocket connected!');
    // var add_chat_html = '<button class="tablinks" onclick="openCity(event,"+ "Tokyo"+")">Tokyo</button>'
    //           $('#chattab').append(add_chat_html);
    // <button class="tablinks" onclick="openCity(event, 'Tokyo')">Tokyo</button>
    // socket.emit('AgentConnection');  
});

var private_socket = io.connect(url+'private');
$('#send_private_message').on('click', function () {
    // var recipient = $('#send_to_username').val();
    // console.log("dev");
    console.log("on click");
    var message_to_send = $('#private_message').val();
    // console.log(message_to_send)
    private_socket.emit('private_message', {
        "type": "agent",
        'username': "",
        'message': message_to_send
    });
});


var private_socket = io.connect(url+'private');

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

function scrollbottom(){

    setTimeout(function(){
        $('.message-panel').scrollTop($('.message-panel')[0].scrollHeight);
    },500);
  

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

var app = angular.module("Agent", []);
app.factory("api",function($http){    
    return {
        getAgentOnline:function(callback){
            $http({
                url: url + 'live_agent',
                method: 'post',
                data:{'Email':agentemail,'agentname':agentname}
            }).then(callback);
        },
        sendKeys:function(value,callback){
            $http({
                url: url + 'hot_keys',
                method: 'post',
                data:{'hotkeyvalue':value}
            }).then(callback);
        },
        getKeys:function(callback){
            $http({
                url: url + 'hot_keys',
                method: 'get',
            }).then(callback);
        },
        getenc:function(callback){
            $http({
                url: url + 'enc',
                method: 'get',
            }).then(callback);
        },
    }
})
    
app.controller("agentController", function ($scope,api, $window,$timeout) {
    // $scope.users = [];
    // $scope.chatHistory = [];
   $scope.logoutLoader=false;
    $scope.chatHistory = chathistory;
    $scope.messages = [];
    $scope.selectedUser = {};
    // $scope.toggleText = (break_status?"away":"resume");
    $scope.breakStatus = break_status;

    $scope.agentOnline = agentlist;
    $scope.agentReplay = {};
    $scope.agentReplay.text = "";

       /////--------------Logout ------------------------
    $scope.logout = function () {

        // var name = $('.agentname').text();
        console.log("Log Out Chat", $scope.chatHistory);
        for (var i = 0; i < $scope.chatHistory.length; i++) {
            private_socket.emit('end_user_message', {
                // "agentname": name,
                // "type": "agent",
                // "username": data[0].username,
                agent_email: agentemail,
                date: new Date(),
                from_id: agentemail,
                fromname: agentname,
                message: "",
                to_id: $scope.chatHistory[i].chatlist[1].to_id,
                toname: $scope.chatHistory[i].chatlist[1].toname,
                type: "agent",
                user_email: $scope.chatHistory[i].chatlist[1].to_id,
                user_details: {}
            });
            
        }
        console.log("change to agent logout");
        $scope.logoutLoader=true;
        $timeout(function(){
            $scope.logoutLoader=false;
            window.location.href = 'agentlogout';
        },3000)
       
    }

    $scope.getChat = function (user) {

        console.log("change chat", user)
        $scope.selectedUser = user;
        // for (var i = 0; i < $scope.chatHistory.length; i++) {
        //     var history = $scope.chatHistory[i][chat.username.toString()];
        //     console.log("for llop", chat.username, history)
        //     if ($scope.chatHistory[i][chat.username.toString()]) {
        //         console.log("found messgae", $scope.chatHistory[i])
        //         $scope.userChat = history;
        //     }
        // }
    }

    $scope.removeUser = function (user) {
        console.log("remove user")
        for (var i = 0; i < $scope.chatHistory.length; i++) {
            if ($scope.chatHistory[i].user1 == user.user1) {

                $scope.chatHistory.splice(i, 1);
                console.log("remove array", $scope.chatHistory);
                $scope.selectedUser = {};
            }
        }
    }
    private_socket.on('agent_new_chat', function (msg) {
        console.log("agent_new_chat", msg)
        // alert(msg);
        console.log("agent_new_chat", msg);
        console.log("first check", agentemail, msg.user2);
        if (agentemail == msg.user2) {
            // for (var i = 0; i < $scope.chatHistory.length; i++) {
            //     if ($scope.chatHistory[i].user1 == msg.user_email) {
            //         $scope.chatHistory[i].chatlist.push(msg)
            //     }
            // }
            msg.isNew = true;
            // msg=anchorme(msg);
            $scope.chatHistory.push(msg);
        }
        // if (msg == "No user available") {
        //     console.log("chat history", $scope.chatHistory);
        //     return
        // } else {
        //     $scope.users.push(msg);
        //     console.log($scope.users, "messge");
        //     var chat = {};
        //     var name = msg.username.toString();
        //     var time = new Date();
        //     chat[name] = [];
        //     chat[name].push({
        //         'message': msg.message,
        //         'username': msg.username,
        //         'time': time,
        //         'agent': msg.agent,
        //         'from': 'user'
        //     })
        //     console.log("chat", chat);
        //     $scope.chatHistory.push(chat);
        //     console.log("chat history", $scope.chatHistory);
        // }


        // var add_tab_html = '<button class="tablinks" onclick="openCity(event, ' + msg['username'] + ')">' + msg[
        //     'username'] + '</button>'
        // $('#chattab').append(add_tab_html)

        // var add_chatwin_html = '<div id="' + msg['username'] + '" class="tabcontent">' +
        //     '<div id = "chat" class="">' +
        //     '<img src="" alt="Avatar" style="width:100%;">' +
        //     '<p>' + msg['message'] + '</p>' +
        //     '<span class="time-right">11:00</span>' +
        //     '</div>'+
        //     '<div style="position:absolute; bottom:1%">'+
        //     '<input class="mytext" type="text" placeholder="Type a message" id="private_message" style="bottom: 2%; width: 50%; margin-left: 1%;" />'+
        //     '<span class="glyphicon glyphicon-share-alt send-glyp"></span>'+
        //     '</div>' 
        //     ;
        // console.log(add_chatwin_html)
        // $('#chatwin').append(add_chatwin_html);

        $scope.$digest();

    });
    private_socket.on('agent_ongoing_chat', function (msg) {
        // console.log("new_private_message")
        // alert(msg);
        scrollbottom();
        $scope.agentReplay.text = null;
        console.log("agent_ongoing_chat", msg);
        console.log("first check", agentemail, msg.agent_email);
        if (agentemail == msg.agent_email) {
            for (var i = 0; i < $scope.chatHistory.length; i++) {
                if ($scope.chatHistory[i].user1 == msg.user_email) {
                    // msg.msg=anchorme(msg.msg);
                    // $scope.html = msg.msg;
                    // $scope.trustedHtml = $sce.trustAsHtml($scope.html);
                    // msg.msg=$scope.trustedHtml;
                    // $(".append-text-left").append("<b>Appended text</b>");
                    $scope.chatHistory[i].chatlist.push(msg)
                }
                if($scope.chatHistory[i].user1 == msg.from_id){
                    $scope.chatHistory[i].isNew = true;
                    notifyMe();
                }
            }
        }

        // ---------------------- Notification Code ----------------------

        var fullMsg = msg.msg;
        // console.log(fullMsg);

        Notification.requestPermission().then(function(result) {
            console.log("notification",result);
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

        // for (var i = 0; i < $scope.chatHistory.length; i++) {
        //     var history = $scope.chatHistory[i][msg.username.toString()];
        //     console.log("for new private llop", msg.username, history)
        //     if ($scope.chatHistory[i][msg.username.toString()]) {
        //         console.log("found messgae", $scope.chatHistory[i])
        //         $scope.userChat = history;
        //         var time = new Date();
        //         $scope.chatHistory[i][msg.username.toString()].push({
        //             'message': msg.message,
        //             'username': msg.username,
        //             'time': time,
        //             'agent': msg.agent,
        //             'from': (msg.type ? 'agent' : 'user')
        //         })
        //     }
        // }




        // var add_tab_html = '<button class="tablinks" onclick="openCity(event, ' + msg['username'] + ')">' + msg[
        //     'username'] + '</button>'
        // $('#chattab').append(add_tab_html)

        // var add_chatwin_html = '<div id="' + msg['username'] + '" class="tabcontent">' +
        //     '<div id = "chat" class="">' +
        //     '<img src="" alt="Avatar" style="width:100%;">' +
        //     '<p>' + msg['message'] + '</p>' +
        //     '<span class="time-right">11:00</span>' +
        //     '</div>'+
        //     '<div style="position:absolute; bottom:1%">'+
        //     '<input class="mytext" type="text" placeholder="Type a message" id="private_message" style="bottom: 2%; width: 50%; margin-left: 1%;" />'+
        //     '<span class="glyphicon glyphicon-share-alt send-glyp"></span>'+
        //     '</div>' 
        //     ;
        // console.log(add_chatwin_html)
        // $('#chatwin').append(add_chatwin_html);

        $scope.$digest();

    });

    

    private_socket.on('user_end_chat', function (endUser) {
        //to end chat

        console.log("inside user end chat", endUser);
        for (var i = 0; i < $scope.chatHistory.length; i++) {
            if ($scope.chatHistory[i].user1 == endUser.useremail) {
                console.log("found user name", $scope.chatHistory[i]);
                $scope.chatHistory[i].isChatEnd = true;
                if ($scope.chatHistory[i].user1 == $scope.selectedUser.user1) {
                    $scope.selectedUser.isChatEnd = true;
                }
                console.log($scope.chatHistory);
            }
        }
        // console.log(msg);
        $scope.$digest();

    });
    private_socket.on('agent_list', function (list) {
        console.log("agent list", list);

        $scope.$digest();

    });
    $scope.sendMessage = function (msg, user) {
        if ($scope.agentReplay.text !== "") {
            console.log('inside send message', msg, user);
            private_socket.emit('second_private_message', {
                // "type": "agent",
                // "agentname": data[0].agent,
                // 'username': data[0].username,
                // 'message': msg
                agent_email: agentemail,
                date: new Date(),
                from_id: agentemail,
                fromname: agentname,
                message: msg,
                to_id: user[1].to_id,
                toname: user[1].toname,
                type: "agent",
                user_email: user[1].to_id,
                user_details: {}
            });
        }
        $scope.agentReplay.text = "";
        console.log("Agent Msg Clear Input", $scope.agentReplay.text);
    }

    // $scope.sendViaEnter = function ($event, msg, user) {
    //     var keycode = $event.which || $event.keycode;
    //     if (keycode === 13) {
    //         $scope.sendMessage(msg, user);
    //     }
    // }    

    $scope.altDown = false;
    $scope.altKey = 18;

    api.getKeys(function(data){
        console.log(data);
        $scope.hotkeys = data.data;
    })

    $scope.keyDownFunc = function($event, msg, user) {
        var keycode = $event.which || $event.keycode;
        if (keycode === 13) {
            $scope.sendMessage(msg, user);
        }
             // alert('Ctrl + C pressed');
        //     if($event.keycode==9){
        //    $scope.altDown = false;
                
        //     }
            if($event.keyCode !== 18 && $event.altKey){
                // console.log($event.keyCode);
                var alphaKey = $event.keyCode;
                api.sendKeys(alphaKey,function(data){
                    // console.log(data.data.message);
                    $scope.agentReplay.text = "";
                    $scope.agentReplay.text = data.data.message;
                })
            }
    
        // else if ($scope.ctrlDown && ($event.keyCode == $scope.vKey)) {
        //     alert('Ctrl + V pressed');
        // } else if ($scope.ctrlDown && String.fromCharCode($event.which).toLowerCase() == 's') {
        //     $event.preventDefault();
        //     alert('Ctrl + S pressed');
        // }
    };
    // angular.element($window).bind("keyup", function($event) {
    //     if ($event.keyCode == $scope.altKey)
    //         $scope.altDown = false;
    //     $scope.$apply();
    // });
    // angular.element($window).bind("keydown", function($event) {
    //     if ($event.keyCode == $scope.altKey)
    //         $scope.altDown = true;
    //     $scope.$apply();
    // });
        


    $scope.break = function () {
        var name = $('.agentname').text();
        console.log(name);
        private_socket.emit('break_message', {
            "agentname": name,
        });
        $scope.breakStatus=!$scope.breakStatus;
    }

    // $scope.changeButtonTxt = true;

    // $scope.$watch('changeButtonTxt', function () {
    //     $scope.toggleText = $scope.changeButtonTxt ? 'Away' : 'Resume';
    // })

    $scope.endChat = function (user) {
        var name = $('.agentname').text();
        console.log("end chat", user);
        private_socket.emit('end_user_message', {
            // "agentname": name,
            // "type": "agent",
            // "username": data[0].username,
            agent_email: agentemail,
            date: new Date(),
            from_id: agentemail,
            fromname: agentname,
            message: "",
            to_id: user[1].to_id,
            toname: user[1].toname,
            type: "agent",
            user_email: user[1].to_id,
            user_details: {}
        });
    }

    ////-------------agent transfer-----------------------
    $scope.transferAgent = function (agent, selectedUser) {
        // console.log(agent, selectedUser,selectedUser.chatlist[1].toname);
        private_socket.emit('second_private_message', {
            // "type": "agent",
            // "agentname": data[0].agent,
            // 'username': data[0].username,
            // 'message': msg
            agent_email: agentemail,
            date: new Date(),
            from_id: agentemail,
            fromname: agentname,
            message: agentname +" has transfered Chat to "+agent.Email ,
            to_id: $scope.selectedUser.chatlist[1].to_id,
            toname: $scope.selectedUser.chatlist[1].toname,
            type: "transfer",
            user_email: $scope.selectedUser.chatlist[1].to_id,
            user_details: {}
        });
        private_socket.emit('transer_agent', {
            new_agent_name: agent.agentname,
            new_agent_email: agent.Email,
            chat_history: selectedUser.chatlist,
            user_email:selectedUser.user1,
            user_name:selectedUser.chatlist[1].toname,
            previous_agent_email:agentemail,
            previous_agent_name:agentname
        })
       
        $scope.selectedUser.isChatEnd = true;
         }
        // alert(msg);
    

    $scope.getLiveAgent=function(){
            // $scope.agentOnline=[]
            api.getAgentOnline(function(data){
                console.log("inside agent online",data);
                $scope.agentOnline=data.data;
                console.log( $scope.agentOnline);
            
            })
        }

        
        // api.getAgentOnline(function(data){
        //     console.log("inside agent online",data);
        //     })






        api.getenc(function(data){
            console.log("get enc",data);
            var iv=data.data.substring(0,16);
            var decrypt=data.data;
// console.log( "----------------decrypted=",d("+█D║┬!YÇù`µ1┼HO¬τMç╬₧│k-¼£╕Å7╞!GδLt_╩▄£nx╙{(,ª£²8Lôδ#√Gú ","å╜╥▄y`(╦YτÖ¢τ┬ ") )
 
;
console.log('sdsadsdasddddddd',decrypts(data.data));
})

    


    });

// var someText = "this is a text with a link www.github.com ..";
// var result = anchorme(someText);
// console.log(result);