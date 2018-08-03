from Crypto import Random
from Crypto.Cipher import AES

def pad(s):
	# print (b"\0")
	print (AES.block_size - len(s) % AES.block_size)
	return s + b"\0" * (AES.block_size - len(s) % AES.block_size)

def encrypt(message, key, key_size=256):
    message = pad(message)
    print '!'*29,len(message)
    iv = Random.new().read(AES.block_size)
    print '@'*20,AES.block_size
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return iv + cipher.encrypt(message)

def decrypt(ciphertext, key):
    iv = ciphertext[:AES.block_size]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = cipher.decrypt(ciphertext[AES.block_size:])
    return plaintext.rstrip(b"\0")
enc = encrypt('plaintextasdfasdfsdffasdfg7gtfyrfytgugytvysafdsdfadsf', 'key1111111111111')
print enc
dec = decrypt(enc, 'key1111111111111')
print dec
