import pymongo
from pymongo import MongoClient
# import datetime

client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.quizdb
statistics = db.statistics
entry = { "name": "giorgos", "score": 567 }
# "date" : datetime.datetime.utcnow()
statistics.insert(entry)