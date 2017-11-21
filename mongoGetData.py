import pymongo
from pymongo import MongoClient


client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.quizdb
collection = db.statistics

# statisticsEntries = collection.count()
# print statisticsEntries
scores = []

for c in collection.find():
    player = c["name"]
    playerScore = 0
    for c in collection.find({"name":player}):
        playerScore = playerScore + c["score"]

    scores.append((player,playerScore))

scores = list(set(scores))
print scores