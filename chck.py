import pymongo
# def mongo_connection():
con = pymongo.MongoClient()
collection = con.LBH

f = collection.agentchat.find_one({'user1':'d','disconnected':'False'})
print f

hist = {'agent':f['user1']}
# print hist
hist['firstmessage'] =  f['contexts'][0]['msg']['Text']
# hist['firstmessage'] = f['contexts'][0]['msg']
# print f['contexts'][1]['msg']
hist['firstmessagetime'] = f['contexts'][0]['curTime']
hist['secondmessage'] = f['contexts'][1]['msg']
hist['secondmessagetime'] = f['contexts'][1]['curTime']
hist['thirdmessagetime'] = f['contexts'][2]['curTime']

hist['thirdmessage'] = f['contexts'][2]['msg']['Text']
print hist