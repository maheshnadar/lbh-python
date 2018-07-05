from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, emit
# from codenames import game
from threading import Lock
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, Namespace, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask import Flask, flash, redirect, render_template, request, session, abort
from flask import render_template, request, flash, session, url_for, redirect
import time
import datetime
import os
import pymongo
import json
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
			f = collection.agentchat.find_one({'user1':session['user_Name'],'disconnected':False})
			hist = {'agent':f['user1']}
			# print hist
			hist['firstmessage'] =  f['contexts'][0]['msg']['Text']
			# hist['firstmessage'] = f['contexts'][0]['msg']
			# print f['contexts'][1]['msg']
			# hist['firstmessagetime'] = f['contexts'][0]['curTime']
			hist['secondmessage'] = f['contexts'][1]['msg']
			# hist['secondmessagetime'] = f['contexts'][1]['curTime']
			# hist['thirdmessagetime'] = f['contexts'][2]['curTime']

			hist['thirdmessage'] = f['contexts'][2]['msg']['Text']
			newhist = json.dumps(hist)
			user ={'user':session['user_Name'],'agent':session['agent'],'history':newhist}
		except:
			user ={'user':session['user_Name'],'agent':session['agent'],'history':""}
		return render_template('index.html',data = user)
#agents area
@app.route('/agentlogin')
def agenthome():
	print "agenthome"
	if not session.get('agent_logged_in'):
		return render_template('Agent.html')
	else:
		
		data = {'agentname':session['agent_Email']}
		print "hello"
		return render_template('Agentindex.html',data=data)
#agents area
@app.route("/agentlogin", methods=["GET", "POST"])
def agent_login():
	if request.method == 'POST':
		print "inside agentlogin"
		#collection = mongo_connection()
		find=collection.usermaster.find_one({'user_id':request.form['Email'],'password':request.form['password'],'user_status':True,'role':'agent'})
		if find:
			print "got find"
			session['agent_logged_in'] = True
			session['agent_Email'] = request.form['Email']
			session.permanent = False	
			# try:
			# 	idleidfind = collection.agentloggedin.find_one(sort=[("idleid", -1)])
			# 	idleid = idleidfind['idleid']+1
			# except:
			# 	idleid =1
			user = {'Email':request.form['Email'],"SID":"sid","connectedagentname":"lol",
					'updatedat':datetime.datetime.now(),'Chatlimit':find['chatlimit'],'break':False,'room':True}
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
		# if session['username']:
		user = {'username':session['user_Name'],'Email':session['user_Email'],"agent":connectedagentname,"createdat": datetime.datetime.utcnow()}
		#collection = mongo_connection()
		collection.userloggedin.update({'username':session['user_Name']},{"$set":user},upsert=True)

		# login_user(request.form['Name'])

	else:
		return abort(401)

	return redirect(url_for('home'))

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
	session.pop('user_Name',None)
	session.pop('user_Email',None)
	return redirect(url_for('home'))


@app.route("/agentlogout")
# @login_required
def agent_logout():

	collection.agentloggedin.delete_many({'Email':session['agent_Email']})
	session.pop('agent_logged_in',None)
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

@socketio.on('second_private_message', namespace='/private')
def second_private_message(payload):
	if payload['type'] == 'user':
		message = {'message': payload['message']}
		message['username'] = payload['username']
		message['agentname'] = payload['agentname']
		emit('second_new_private_message', message, broadcast=True)
		emit('agent_new_private_message', message, broadcast=True)
	else:
		message = {'message': payload['message']}
		message['username'] = payload['username']
		message['agentname'] = payload['agentname']
		emit('second_agent_new_private_message', message, broadcast=True)
		emit('agent_new_private_message', message, broadcast=True)

@socketio.on('private_message', namespace='/private')
def private_message(payload):
	if payload['type'] == 'user':
		message = {'message': payload['message']}
		message['username'] = payload['username']
		message['type'] = "user"
		print "###Inside User"
		# if session['agent']:
		print "##### Inside session agent"
		idleidfind = collection.agentloggedin.find_one({'break':False,'room':True},sort=[("updatedat", 1)],limit=1)		
		#finding an agent
		# import pdb
		# pdb.set_trace()
		try:
			if idleidfind:
				if idleidfind:
					print "########## found an agent"
					# recipient_session_id = idleidfind['SID']
					session['agent'] = idleidfind['Email']
					session['connected'] = True
					# print session['username']
					message['agent'] = idleidfind['Email']
					print session['agent']
					print "agentname"
					
				
					collection.agentloggedin.update({'Email':idleidfind['Email']},{"$push":{'chatingwith':payload['username']}},upsert=False)
					collection.agentloggedin.update({'Email':idleidfind['Email']},{"$set":{'updatedat':datetime.datetime.now()}},upsert=False)
					# print recipient_session_id
					if len(idleidfind['chatingwith'])>= idleidfind['Chatlimit']:
						collection.agentloggedin.update({'Email':idleidfind['Email']},{"$set":{'room':False}},upsert=False)			
					print "dataupdated"
					timeint = datetime.datetime.now()
					agenthistory = {
							"createdAt": timeint,
							"updatedAt": timeint,
							"socketid1": "",
							"socketid2": "",
							"disconnected": "False",
							"user1": payload['username'],
							"user2": idleidfind['Email'],
							"session_id": "null",
							"contexts": [{
									"curTime": timeint,
									"position": "left",
									"msg": {
										"type": "SYS_FIRST",
										"Text": "Hi "+payload['username'] +"! Welcome to Ross-Simons live chat support. What can we help you with?"
									},
									"id": "id"
								},
								{
									"curTime": timeint,
									"position": "right",
									"msg": payload['message'],
									"id": "id"
								},
								{
									"curTime": timeint,
									"position": "left",
									"msg": {
										"type": "SYS_EMPTY_RES",
										"Text": "Hi, I am Dawn  and I will be assisting you today!"
									},
									"id": "id"
								}
							],
							"chatlist": [],
							"__v": "",
							"like": "",
							"disconnectby": ""
						}
					# print agenthistory
					collection.agentchat.insert_one(agenthistory)
					print "new agentchat"
					emit('new_private_message', message, broadcast=True)
					print "done",message
					# collection.close()
				else:
					# print "own"
					emit('new_private_message', message, broadcast=True)
					# print "hello"
		except:
			emit('new_private_message', "No user available", broadcast=True)
			pass
	else:
		message = {'message': payload['message']}
		message['agentname'] = payload['agentname']
		message['username'] = payload['username']
		message['type'] = "agent"
		emit('agent_new_private_message', message, broadcast=True)
		emit('second_new_private_message', message, broadcast=True)
		print "Message by agent "

		pass
if __name__ == '__main__':
	# app.secret_key = os.urandom(12)
	socketio.run(app, debug=True)