var app = angular.module("Agent", []);

app.controller("agentController", function ($scope) {
    // $scope.users = [];
    // $scope.chatHistory = [];
    $scope.chatHistory = chathistory;
    $scope.messages = [];
    $scope.toggleText = "break"
    $scope.getChat = function (chat) {

        console.log("change chat", chat)
        $scope.messages = chat;
        // for (var i = 0; i < $scope.chatHistory.length; i++) {
        //     var history = $scope.chatHistory[i][chat.username.toString()];
        //     console.log("for llop", chat.username, history)
        //     if ($scope.chatHistory[i][chat.username.toString()]) {
        //         console.log("found messgae", $scope.chatHistory[i])
        //         $scope.userChat = history;
        //     }
        // }
    }
    private_socket.on('agent_new_chat', function (msg) {
        console.log("agent_new_chat", msg)
        // alert(msg);
        console.log("agent_new_chat", msg);
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
        console.log("agent_new_chat", msg)
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
    $scope.sendMessage = function (msg,user) {
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
            user_email: user[1].to_id
        });
    }

    $scope.break = function () {
        var name = $('.agentname').text();
        console.log(name);
        private_socket.emit('break_message', {
            "agentname": name,
        });
    }

    $scope.changeButtonTxt = true;

    $scope.$watch('changeButtonTxt', function () {
        $scope.toggleText = $scope.changeButtonTxt ? 'Break' : 'Resume';
    })

    $scope.endChat = function (data) {
        var name = $('.agentname').text();
        console.log(name, data[0].username);
        private_socket.emit('end_message', {
            "agentname": name,
            "type": "agent",
            "username": data[0].username,
        });
    }
});