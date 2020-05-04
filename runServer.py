import os
# os.system("export GOOGLE_APPLICATION_CREDENTIALS=${PWD}/server/google_credentials.json")
currentDir = '~/Documents/Projects/es-to-anki/'
os.system('GOOGLE_APPLICATION_CREDENTIALS={}/server/google_credentials.json nodemon {}/server/server.js'.format(currentDir, currentDir))