
from threading import Lock
from flask_socketio import SocketIO, Namespace, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask import Flask, flash, redirect, render_template, request, session, abort,url_for,redirect
import time
import datetime
import os
import pymongo
import json
from config_update import user_got_connected,user_got_disconnected,save_chat,second_save_chatlist
# def mongo_connection():
con = pymongo.MongoClient()
collection = con.lbh
	# return collection
# app = Flask(__name__)
app = Flask(__name__)
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'secret_xxx'
)
socketio = SocketIO(app)
ROOMS = {} # dict to track active rooms
 #user area
@app.route('/')
def home():
	print "Home"

	if not session.get('user_logged_in'):
		return render_template('user.html')
	else:
		
		try:
			print session['user_Email']
			f = collection.agentchat.find_one({'user1':session['user_Email'],'disconnected':"False"},{'_id': False})
			user ={'user':session['user_Name'],'useremail':session['user_Email'],'agent':session['agent'],'history':f}
		except:
			user ={'user':session['user_Name'],'useremail':session['user_Email'],'agent':session['agent'],'history':""}
		return render_template('index.html',data = user)
#agents area
@app.route('/agent')
def agenthome():
	print "agenthome"
	if not session.get('agent_logged_in'):
		return render_template('Agent.html')
	else:
		hist = list(collection.agentchat.find({'user2':session['agent_Email'],'disconnected':"False"},{'_id': False}))
		# print hist
		data = {'agentemail':session['agent_Email'],'agentname':session['agent_name'],'history':hist}

		return render_template('Agentindex.html',data=data)
#agents area
@app.route("/agentlogin", methods=["GET", "POST"])
def agent_login():
	if request.method == 'POST':
		print "inside agentlogin"
		#collection = mongo_connection()
		find=collection.usermaster.find_one({'user_id':request.form['Email'],'password':request.form['password'],'user_status':True,'role':'agent'})
		if find:
			session['agent_logged_in'] = True
			session['agent_Email'] = request.form['Email']
			session['agent_name'] = find['user_name']
			session.permanent = False	
			user = {'Email':request.form['Email'],"SID":"sid","connectedagentname":"lol",
					'updatedat':datetime.datetime.now(),'agentname':find['user_name'],'Chatlimit':find['chatlimit'],'break':False,'room':True}
			collection.agentloggedin.insert_one(user)
			return redirect(url_for('agenthome'))
	else:
		return abort(401)




	# return redirect(url_for('home'))

@app.route("/userlogin", methods=["GET", "POST"])
def user_login():
	if request.method == 'POST':
		session['user_logged_in'] = True
		session['user_Name'] = request.form['Name']
		session['user_Email'] = request.form['Email']
		session['agent'] = "None"
		session.permanent = False
		connectedagentname = None
		user = {'username':session['user_Name'],'Email':session['user_Email'],"agent":connectedagentname,"createdat": datetime.datetime.utcnow()}
		#collection = mongo_connection()
		collection.userloggedin.update({'username':session['user_Name']},{"$set":user},upsert=True)
		return redirect(url_for('home'))
	else:
		return abort(401)

	

# @app.before_request
# def make_session_permanent():
# 	print "here"
# 	session.permanent = False

@app.route("/userlogout")
# @login_required
def user_logout():
	print "user logout"
	# emit('userdisconnect_message', "message", broadcast=True)
	session.pop('user_logged_in',None)
	session.pop('agent',None)
	collection.userloggedin.delete_many({'username':session['user_Name'],'Email':session['user_Email']})
	collection.agentchat.update({'user1':session['user_Name']},{'$set':{'disconnected':"True"}},upsert=False)
	collection.agentchat.update({'user1':session['user_Name']},{'$set':{'disconnectby':session['user_Name']}},upsert=False)
	# collection.agentloggedin.update({'Email':idleidfind['Email']},{"$pull":{'chatingwith':session['user_Name']}},upsert=False)
	collection.agentloggedin.update({'chatingwith':session['user_Name']},{'$pull':{'chatingwith':session['user_Name']}})
	collection.agentloggedin.update({'chatingwith':session['user_Name']},{'$set':{'room':True}})					
	session.pop('user_Name',None)
	session.pop('user_Email',None)
	return redirect(url_for('home'))


@app.route("/agentlogout")
# @login_required
def agent_logout():
	f = collection.agentloggedin.find_one({'Email':session['agent_Email']})
	try:
		for i in f['chatingwith']:
			emit('new_private_message', {'message':'disconnected','username':i,'agent':session['agent_Email']}, broadcast=True)
			print i,"############"
	except Exception as e:
		pass
	
	collection.agentloggedin.delete_many({'Email':session['agent_Email']})

	session.pop('agent_logged_in',None)
	session.pop('agent_Email',None)
	
	return redirect(url_for('agenthome'))
# initialize Flask

# @app.route('/')
# def index():
#     """Serve the index HTML"""
#     return render_template('index.html')

@socketio.on('Endchat')
def on_Endchat():
	user_logout()
	print "user connect"
	print "#################################"
@socketio.on('connect')
def on_connect():
	print "user"

@socketio.on('disconnect')
def disconnect_user():
    # logout_user()
	print 'disconnected'
	session.pop('user_logged_in',None)
	session.pop('agent',None)
	collection.userloggedin.delete_many({'username':session['user_Name'],'Email':session['user_Email']})
	collection.agentchat.update({'user1':session['user_Name']},{'$set':{'disconnected':"True"}},upsert=False)
	collection.agentchat.update({'user1':session['user_Name']},{'$set':{'disconnectby':session['user_Name']}},upsert=False)
	emit('userdisconnect_message', "message", broadcast=True)
	session.pop('user_Name',None)
	session.pop('user_Email',None)
	return redirect(url_for('home'))


@socketio.on('username', namespace='/private')
def receive_username(username):
    print request.sid
    users[username] = request.sid
    #users.append({username : request.sid})
    #print(users)
    print('Username added!')

#user
@socketio.on('Connection')
def Connection():
	try:
		connectedagentname = session['connectedagentname']
	except:
		connectedagentname = None
	# if session['username']:
	user = {'username':session['user_Name'],'Email':session['user_Email'],'SID':request.sid,"connectedagentname":connectedagentname}
	#collection = mongo_connection()
	collection.userloggedin.update({'username':session['user_Name']},{"$set":user},upsert=True)
	# collection.close()
	# print "payload"
#agent
@socketio.on('AgentConnection')
def AgentConnection():
	user = {'SID':request.sid}
	collection.agentloggedin.update({'Email':session['agent_Email']},{"$set":user},upsert=True)

@socketio.on('endChat',namespace='/private')
def endChat(payload):
	print 'Endchat'
	if payload['type'] == 'agent':
		message={'message':'Chat Ended by agent','agentname':payload['agentname'],'username':payload['username']}
		emit('end_chat_message', message, broadcast=True)

@socketio.on('break_message',namespace='/private')
def break_message(payload):
	
	print "Inside break message"
	collection.agentloggedin.update({'Email':session['agent_Email']},{"$set":{'break':True}},upsert=False)

@socketio.on('second_private_message', namespace='/private')
def second_private_message(payload):
	print payload
	if payload['type'] == 'user':
		# {
  #               "type": "user",
  #               "date": new Date(),
  #               "from_id": useremail,
  #               "fromname": username,
  #               "to_id": "none",
  #               "message": message,
  #               "toname": agent,
  #               "type": "user",
  #           }
		mess = second_save_chatlist(payload['type'],payload['user_email'],payload['agent_email'],payload['from_id'],payload['from_id'],payload['to_id'],payload['fromname'],payload['toname'],payload['message'])
		emit('user_ongoing_chat', mess, broadcast=True)
		emit('agent_ongoing_chat', mess, broadcast=True)
	else:
		mess = second_save_chatlist(payload['type'],payload['user_email'],payload['agent_email'],payload['from_id'],payload['from_id'],payload['to_id'],payload['fromname'],payload['toname'],payload['message'])		
		emit('user_ongoing_chat', mess, broadcast=True)
		emit('agent_ongoing_chat', mess, broadcast=True)

@socketio.on('private_message', namespace='/private')
def private_message(payload):
	print "private_message"
	print payload
	if payload['type'] == 'user':
		message = {'message': payload['message']}
		message['username'] = payload['fromname']
		message['useremail'] = payload['from_id']


		idleidfind = collection.agentloggedin.find_one({'break':False,'room':True},sort=[("updatedat", 1)],limit=1)		
		print idleidfind,"@@@@@@@@@@@@@@"

		if idleidfind:

			print "########## found an agent"
			session['agent'] = idleidfind['Email']	
			message['agent'] = idleidfind['Email']
			# session['connected'] = True
			print "after sesion"
							
		
			if idleidfind:
				collection.agentloggedin.update({'Email':idleidfind['Email']},{"$push":{'chatingwith':payload['fromname']}},upsert=False)
				collection.agentloggedin.update({'Email':idleidfind['Email']},{"$set":{'updatedat':datetime.datetime.now()}},upsert=False)
				try:
					if len(idleidfind['chatingwith'])>= idleidfind['Chatlimit']:
						collection.agentloggedin.update({'Email':idleidfind['Email']},{"$set":{'room':False}},upsert=False)			
				except:
					pass
			# print recipient_session_id
			# print "before_request"
			# print message['username'],message['agent']
			print "dataupdated"
			mes= collection.thememasters.find_one({})
			firstmess = "Hi {}!{}".format(message['username'],mes['welcome_message'])
			save_chat(message['useremail'],idleidfind['Email'],message['message'])
			firt_response = second_save_chatlist("agent",message['useremail'],idleidfind['Email'],message['useremail'],message['useremail'],idleidfind['Email'],message['username'],idleidfind['agentname'],firstmess)
			second_response = second_save_chatlist("user",message['useremail'],idleidfind['Email'],message['useremail'],idleidfind['Email'],message['useremail'],idleidfind['agentname'],message['username'],message['message'])

			agentmess = "Hi, I am {}{}".format(idleidfind['agentname'],mes['agent_message'])
			third_response = second_save_chatlist('agent',message['useremail'],idleidfind['Email'],message['useremail'],message['useremail'],idleidfind['Email'],message['username'],idleidfind['agentname'],agentmess)
			message['frist_agent_message'] = agentmess
			emit('new_private_message', second_response, broadcast=True)
			emit('new_private_message', third_response, broadcast=True)
			d = {'user1':message['useremail'],'user2':idleidfind['agentname'],'disconnected':"False"}
			print d,'$$$$$$$$$$$$$$$$'
			agentmessage = collection.agentchat.find_one({'user1':message['useremail'],'user2':idleidfind['Email'],'disconnected':"False"},{'_id': False})
			print agentmessage,"@@@@@@@@@@@@@@@@"	
			emit('agent_new_chat',agentmessage,broadcast=True)
			print "done",message
			# collection.close()
		else:
			print "except"
			message['offline'] = "No user available"
			emit('offline_message', message ,broadcast=True)
			pass
	else:
		message = {'message': payload['message']}
		message['agentname'] = payload['agentname']
		message['username'] = payload['username']
		
		emit('agent_new_private_message', message, broadcast=True)
		emit('second_new_private_message', message, broadcast=True)
		
		print "Message by agent "

		pass
if __name__ == '__main__':
	# app.secret_key = os.urandom(12)
	socketio.run(app, debug=True)
