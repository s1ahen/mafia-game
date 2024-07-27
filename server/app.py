from flask import Flask, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
import random
import string

app = Flask(__name__, static_folder='../client')
socketio = SocketIO(app, cors_allowed_origins="*")

games = {}

def generate_game_code():
    return ''.join(random.choices(string.digits, k=5))

@app.route('/create', methods=['POST'])
def create_game():
    game_code = generate_game_code()
    games[game_code] = {'players': {}, 'roles': [], 'state': {'night': True, 'actions': []}}
    return jsonify({'game_code': game_code})

@app.route('/join

