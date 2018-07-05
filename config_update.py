import pymongo
import datetime
con = pymongo.MongoClient()
collection = con.lbh


def user_got_connected(username,agentname):
	print username,agentname
	idleidfind= collection.agentloggedin.find_one({'Email':agentname})
	collection.agentloggedin.update({'Email':agentname},{"$push":
		{'chatingwith':username}},upsert=False)
	collection.agentloggedin.update({'Email':agentname},{"$set":
		{'updatedat':datetime.datetime.now()}},upsert=False)
	idleidfind= collection.agentloggedin.find_one({'Email':agentname})
	if len(idleidfind['chatingwith'])>= idleidfind['Chatlimit']:
		collection.agentloggedin.update({'Email':agentname},{"$set":{'room':False}},upsert=False)
	return True


def user_got_disconnected(username,agentname):
	pass
def save_chat(useremail,agentemail,message):

	print "in save_chat"
	print useremail,agentemail,message
	timeint = datetime.datetime.now()
	agenthistory = {
					"createdAt": timeint,
					"updatedAt": timeint,
					"disconnected": "False",
					"user1": useremail,
					"user2": agentemail,
					"chatlist": [],
					"__v": "",
					"like": "",
					"disconnectby": ""
				}

	f =collection.agentchat.insert_one(agenthistory)
	print "#############",f
	return True

def second_save_chatlist(useremail,from_id,to_id,fromname,toname,message):
	timeint = datetime.datetime.now()
	chat = {
            "from_id" : from_id, 
            "to_id" : to_id, 
            "fromname" : fromname, 
            "toname" : toname, 
            "msg" : message, 
            "date" : ""
        }
	collection.agentchat.update({'user1':useremail},{"$push":{'chatlist':chat}},upsert=False)
#user_got_connected("d","dev@lbh.com")
# save_chat("dev@gmail","dev@lbh.com","d")