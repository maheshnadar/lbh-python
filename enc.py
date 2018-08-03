from Crypto import Random
from Crypto.Cipher import AES
import base64

# def pad(s):
# 	# print (b"\0")
# 	print (AES.block_size - len(s) % AES.block_size)
# 	return s + b"\0" * (AES.block_size - len(s) % AES.block_size)

# def encrypt(message, key, key_size=256):
#     message = pad(message)
#     iv = Random.new().read(AES.block_size)
#     cipher = AES.new(key, AES.MODE_CBC, iv)
#     print iv,"@"
#     print cipher.encrypt(message),'#'
#     return iv + cipher.encrypt(message)

# def decrypt(ciphertext, key):
#     iv = ciphertext[:AES.block_size]
#     cipher = AES.new(key, AES.MODE_CBC, iv)
#     plaintext = cipher.decrypt(ciphertext[AES.block_size:])
#     return plaintext.rstrip(b"\0")
# enc = encrypt('plaintextasdfasdfsdffasdfg7gtfyrfytgugytvysafdsdfadsf', 'key1111111111111')
# print enc
# dec = decrypt(enc, 'key1111111111111')
# print dec
BLOCK_SIZE = 16
key = b"1234567890123456"

def pad(data):
    length = BLOCK_SIZE - (len(data) % BLOCK_SIZE)
    return data + chr(length)*length

def unpad(data):
    return data[:-ord(data[-1])]

def encrypt(message, passphrase):
    IV = Random.new().read(BLOCK_SIZE)
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    return base64.b64encode(IV + aes.encrypt(pad(message)))

def decrypt(encrypted, passphrase):
    encrypted = base64.b64decode(encrypted)
    IV = encrypted[:BLOCK_SIZE]
    aes = AES.new(passphrase, AES.MODE_CBC, IV)
    return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]))