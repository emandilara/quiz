# project/__init__.py


from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from project.config import BaseConfig
import pymongo
from pymongo import MongoClient
import datetime

# config

app = Flask(__name__)
app.config.from_object(BaseConfig)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

from project.models import User


# routes

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/register', methods=['POST'])
def register():
    json_data = request.json
    user = User(
        email=json_data['email'],
        password=json_data['password']
    )
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'
    except:
        status = 'this user is already registered'
    db.session.close()
    return jsonify({'result': status})


@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        session['logged_in'] = True
        session['username'] = json_data['email']
        print session['username']
        status = True
    else:
        status = False
    return jsonify({'result': status})


@app.route('/api/logout')
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})


@app.route('/api/status')
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'status': True})
    else:
        return jsonify({'status': False})


@app.route('/api/username')
def username():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'username': session['username']})
    else:
        return jsonify({'username': 'unknown'})


@app.route('/api/statistics')
def statistics():
    if session.get('logged_in'):
        if session['logged_in']:
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

            return jsonify({ 'statistics': scores })
    else:
        return jsonify({'Unaccessible': 'Please log in'})

# @app.route('/api/userStatistics')
# def userStatistics():
    # if session.get('logged_in'):
    #     if session['logged_in']:
    #         client = MongoClient('localhost', 27017)
    #         db = client.quizdb
    #         collection = db.statistics
    #
    #         # statisticsEntries = collection.count()
    #         # print statisticsEntries
    #         scores = []
    #
    #         for c in collection.find():
    #             player = c["name"]
    #             playerScore = 0
    #             for c in collection.find({"name":player}):
    #                 playerScore = playerScore + c["score"]
    #
    #             scores.append((player,playerScore))
    #
    #         scores = list(set(scores))
    #
    #         return jsonify({ 'statistics': scores })
    # else:
    #     return jsonify({'Unaccessible': 'Please log in'})


@app.route('/api/scores', methods = ['POST'])
def submitScore():
    if session.get('logged_in'):
        if request.method == 'POST':
            client = MongoClient('localhost', 27017)
            db = client.quizdb
            statistics = db.statistics
            print request.data
            score = request.data.split(":")
            score = score[1].replace("}","")
            entry = { "name": session['username'], "score": int(score), "date" : datetime.datetime.utcnow()}
            # "date" : datetime.datetime.utcnow()
            statistics.insert(entry)
            return jsonify({ 'POST request': 'OK' })
    else:
        return jsonify({'Unaccessible': 'Please log in'})
