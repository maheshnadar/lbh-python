var socket = io.connect('http://' + document.domain + ':' + location.port);
// verify our websocket connection is established
socket.on('connect', function () {
    console.log('Websocket connected!');
    // var add_chat_html = '<button class="tablinks" onclick="openCity(event,"+ "Tokyo"+")">Tokyo</button>'
    //           $('#chattab').append(add_chat_html);
    // <button class="tablinks" onclick="openCity(event, 'Tokyo')">Tokyo</button>
    // socket.emit('AgentConnection');  
});

var private_socket = io.connect('http://127.0.0.1:5000/private');
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


var private_socket = io.connect('http://127.0.0.1:5000/private');
// private_socket.on('new_private_message', function (msg) {
//     // console.log("new_private_message")
//     // alert(msg);
//     console.log("new_private_message",msg);
//     var add_tab_html = '<button class="tablinks" onclick="openCity(event, ' + msg['username'] + ')">' + msg[
//         'username'] + '</button>'
//     $('#chattab').append(add_tab_html)

//     var add_chatwin_html = '<div id="' + msg['username'] + '" class="tabcontent">' +
//         '<div id = "chat" class="">' +
//         '<img src="" alt="Avatar" style="width:100%;">' +
//         '<p>' + msg['message'] + '</p>' +
//         '<span class="time-right">11:00</span>' +
//         '</div>'+
//         '<div style="position:absolute; bottom:1%">'+
//         '<input class="mytext" type="text" placeholder="Type a message" id="private_message" style="bottom: 2%; width: 50%; margin-left: 1%;" />'+
//         '<span class="glyphicon glyphicon-share-alt send-glyp"></span>'+
//         '</div>' 
//         ;
//     console.log(add_chatwin_html)
//     $('#chatwin').append(add_chatwin_html);

// });

// exp---------------------------------->
var me = {};
me.avatar =
    "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

var you = {};
you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";

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
// insertChat("me",
//     "Hi Abhishek Fulzele Chrome! Welcome to Ross-Simons live chat support. What can we help you with?", 0);
// insertChat("you", "Hi, Pablo", 1500);
// insertChat("me", "What would you like to talk about today?", 3500);
// insertChat("you", "Tell me a joke", 7000);
// insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
// insertChat("you", "LOL", 12000);