import pymongo
import datetime
from pytz import timezone
tz = timezone('EST')
# datetime.now(tz) 
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
def save_chat(useremail,agentemail,message,userdetails):

	print "in save_chat"
	print useremail,agentemail,message
	timeint = str(datetime.datetime.now(tz))
	# timeint = datetime.datetime.now(tz)
	agenthistory = {
					"createdAt": timeint,
					"updatedAt": timeint,
					"disconnected": "False",
					"user1": useremail,
					"user2": agentemail,
					"chatlist": [],
					"__v": "",
					"like": "",
					"disconnectby": "",
					"userdetails":userdetails
				}

	f =collection.agentchat.insert_one(agenthistory)
	# print "#############",f
	return True

def second_save_chatlist(typeq,user_email,agent_email,useremail,from_id,to_id,fromname,toname,message,userdetails):
	print "second_save_chatlist"
	print typeq,user_email,agent_email,useremail,from_id,to_id,fromname,toname,message
	timeint = str(datetime.datetime.now(tz))
	# timeint = datetime.datetime.now(tz)
	chat = {
			"type":typeq,
			"user_email":user_email,
			"agent_email":agent_email,
            "from_id" : from_id, 
            "to_id" : to_id, 
            "fromname" : fromname, 
            "toname" : toname, 
            "msg" : message, 
            "date" : timeint,
			"userdetails":userdetails
        }
	# print chat
						# ({'Email':idleidfind['Email']},{"$push":{'chatingwith':payload['fromname']}},upsert=False)
	print collection.agentchat.update({'user1':user_email,'disconnected':"False" },{"$push":{'chatlist':chat}})
	return chat
#user_got_connected("d","dev@lbh.com")
# save_chat('asdf@asdf', 'dev@lbh.com',"d")
# second_save_chatlist('asdf@asdf', 'asdf@asdf', 'dev@lbh.com', 'asdf', 'dev', 'Hi, I am dev and I will be assisting you today!')