d = { 
    "createdAt" : ISODate("2018-06-28T20:09:50.320+0000"), 
    "updatedAt" : ISODate("2018-06-28T20:22:48.661+0000"), 
    "socketid1" : "8E2N9FFuIOJvabgzACo9", 
    "socketid2" : "gurKgKwdSh3VpmjdACas", 
    "disconnected" : true, 
    "user1" : "amol.b@spluspl.com", 
    "user2" : "rresende@ross-simons.com", 
    "session_id" : null, 
    "contexts" : [
        {
            "curTime" : "2018-06-28T20:09:47.130Z", 
            "position" : "left", 
            "msg" : {
                "type" : "SYS_FIRST", 
                "Text" : "Hi Amol! Welcome to Ross-Simons live chat support. What can we help you with?"
            }, 
            "id" : "id"
        }, 
        {
            "curTime" : "2018-06-28T20:09:54.630Z", 
            "position" : "right", 
            "msg" : "Hi", 
            "id" : "id"
        }, 
        {
            "curTime" : "2018-06-28T20:09:55.198Z", 
            "position" : "left", 
            "msg" : {
                "type" : "SYS_EMPTY_RES", 
                "Text" : "Hi, I am Roberta  and I will be assisting you today!"
            }, 
            "id" : "id"
        }
    ], 
    "chatlist" : [
        {
            "from_id" : "amol.b@spluspl.com", 
            "to_id" : "rresende@ross-simons.com", 
            "fromid" : NumberInt(3673), 
            "toid" : NumberInt(3245), 
            "fromname" : "Amol ", 
            "toname" : "Roberta", 
            "msg" : "Hi", 
            "from_socketid" : "8E2N9FFuIOJvabgzACo9", 
            "to_socketid" : "gurKgKwdSh3VpmjdACas", 
            "_id" : ObjectId("5b35408ec053e71dc82b88ea"), 
            "date" : ISODate("2018-06-28T20:09:50.319+0000")
        }, 
        {
            "date" : ISODate("2018-06-28T20:10:06.767+0000"), 
            "_id" : ObjectId("5b35409ec053e71dc82b88ef"), 
            "to_socketid" : "gurKgKwdSh3VpmjdACas", 
            "from_socketid" : "8E2N9FFuIOJvabgzACo9", 
            "msg" : "This is testing of the chat function", 
            "toname" : "Roberta", 
            "fromname" : "Amol ", 
            "toid" : NumberInt(3245), 
            "fromid" : NumberInt(3673), 
            "to_id" : "rresende@ross-simons.com", 
            "from_id" : "amol.b@spluspl.com"
        }, 
        {
            "date" : ISODate("2018-06-28T20:10:17.830+0000"), 
            "_id" : ObjectId("5b3540a9c053e71dc82b88f0"), 
            "to_socketid" : "gurKgKwdSh3VpmjdACas", 
            "from_socketid" : "8E2N9FFuIOJvabgzACo9", 
            "msg" : "Write someting", 
            "toname" : "Roberta", 
            "fromname" : "Amol ", 
            "toid" : NumberInt(3245), 
            "fromid" : NumberInt(3673), 
            "to_id" : "rresende@ross-simons.com", 
            "from_id" : "amol.b@spluspl.com"
        }, 
        {
            "date" : ISODate("2018-06-28T20:11:26.583+0000"), 
            "_id" : ObjectId("5b3540eec053e71dc82b88f7"), 
            "to_socketid" : "gurKgKwdSh3VpmjdACas", 
            "from_socketid" : "8E2N9FFuIOJvabgzACo9", 
            "msg" : "can you write something", 
            "toname" : "Roberta", 
            "fromname" : "Amol ", 
            "toid" : NumberInt(3245), 
            "fromid" : NumberInt(3673), 
            "to_id" : "rresende@ross-simons.com", 
            "from_id" : "amol.b@spluspl.com"
        }
    ], 
    "__v" : NumberInt(0)
}
import json
d = json.loads(d)