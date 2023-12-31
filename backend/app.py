from flask import Flask, request, jsonify, session, send_file
from flask_migrate import Migrate
from sqlalchemy.exc import SQLAlchemyError
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from models import db, User, Song, Playlist, Artist, File, playlist_song
from uuid import uuid4
import os

app = Flask(__name__)

app.config['SECRET_KEY'] = 'matias123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://vseviln:Vasena0400@vseviln.mysql.pythonanywhere-services.com/vseviln$default'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vseviln$default'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['UPLOAD_FOLDER'] = 'uploads'

bcrypt = Bcrypt(app)
CORS(app, origins=["http://localhost:3000", "https://track-up-taupe.vercel.app"], supports_credentials=True)
db.init_app(app)
migrate = Migrate(app, db)

def error_response(status_code, message):
    response = jsonify({'error': message})
    response.status_code = status_code
    return response

with app.app_context():
    db.create_all()

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route("/signup", methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id
    session.modified = True  # Explicitly save the session

    return jsonify({
        "message": "User created successfully.",
        "login": "/login",
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id
    session.modified = True  # Explicitly save the session

    return jsonify({
        "message": "User logged in successfully.",
        "id": user.id,
        "email": user.email
    })

@app.route('/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)

    if user:
        user_data = {
            'id': user.id,
            'email': user.email,
            'songs': [{'id': song.id, 'name': song.name} for song in user.songs],
            'playlists': [{'id': playlist.id, 'name': playlist.name} for playlist in user.playlists]
        }

        return jsonify(user_data)
    else:
        return error_response(404, 'User not found')

    
# Create a new song
@app.route('/songs', methods=['POST'])
def create_song():
    data = request.form
    if not data or not 'name' in data or not 'user_id' in data:
        return error_response(400, 'Invalid data')

    try:
        new_song = Song(name=data['name'], about=data.get('about', ''), user_id=data['user_id'])
        db.session.add(new_song)
        db.session.commit()

        if 'file' in request.files and request.files['file']:
            # Save file information with the associated song
            file = request.files['file']
            if file:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                new_file = File(filename=filename, user_id=data['user_id'], song_id=new_song.id)
                db.session.add(new_file)
                db.session.commit()

        return jsonify(new_song.id), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return error_response(500, str(e))


# Get a song by ID
@app.route('/songs/<song_id>', methods=['GET'])
def get_song(song_id):
    song = Song.query.get(song_id)
    if song:
        return jsonify(song_id=song.id, name=song.name, about=song.about, user_id=song.user_id)
    else:
        return error_response(404, 'Song not found')

# Update a song
@app.route('/songs/<song_id>', methods=['PUT'])
def update_song(song_id):
    song = Song.query.get(song_id)
    if song:
        data = request.json
        song.name = data.get('name', song.name)
        song.about = data.get('about', song.about)
        db.session.commit()
        return jsonify('Song updated successfully'), 200
    else:
        return error_response(404, 'Song not found')

# Delete a song
@app.route('/songs/<song_id>', methods=['DELETE'])
def delete_song(song_id):
    song = Song.query.get(song_id)
    if song:
        db.session.delete(song)
        db.session.commit()
        return jsonify('Song deleted successfully'), 200
    else:
        return error_response(404, 'Song not found')

# Routes for Playlist entity

# Create a new playlist
@app.route('/playlists', methods=['POST'])
def create_playlist():
    data = request.json
    if not data or not 'name' in data or not 'user_id' in data:
        return error_response(400, 'Invalid data')

    try:
        new_playlist = Playlist(name=data['name'], about=data.get('about', ''), user_id=data['user_id'])
        db.session.add(new_playlist)
        db.session.commit()
        return jsonify(new_playlist.id), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return error_response(500, str(e))

# Delete a playlist by ID
@app.route('/playlists/<playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        try:
            db.session.delete(playlist)
            db.session.commit()
            return jsonify('Playlist deleted successfully'), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return error_response(500, str(e))
    else:
        return error_response(404, 'Playlist not found')

# Get a playlist by ID
@app.route('/playlists/<playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        songs_in_playlist = [song.id for song in playlist.songs]
        return jsonify(playlist_id=playlist.id, name=playlist.name, about=playlist.about, songs=songs_in_playlist)
    else:
        return error_response(404, 'Playlist not found')

# Add a song to a playlist
@app.route('/playlists/<playlist_id>/songs/<song_id>', methods=['POST'])
def add_song_to_playlist(playlist_id, song_id):
    playlist = Playlist.query.get(playlist_id)
    song = Song.query.get(song_id)
    if playlist and song:
        try:
            playlist.songs.append(song)
            db.session.commit()
            return jsonify('Song added to playlist successfully'), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return error_response(500, str(e))
    else:
        return error_response(404, 'Playlist or song not found')

# Remove a song from a playlist
@app.route('/playlists/<playlist_id>/songs/<song_id>', methods=['DELETE'])
def remove_song_from_playlist(playlist_id, song_id):
    playlist = Playlist.query.get(playlist_id)
    song = Song.query.get(song_id)
    if playlist and song and song in playlist.songs:
        try:
            playlist.songs.remove(song)
            db.session.commit()
            return jsonify('Song removed from playlist successfully'), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return error_response(500, str(e))
    else:
        return error_response(404, 'Playlist or song not found or not in the playlist')


@app.route('/upload', methods=['POST'])
def upload_file():
    data = request.form
    if not data or not 'name' in data or not 'user_id' in data:
        return error_response(400, 'Invalid data')

    user_id = data['user_id']

    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        new_file = File(filename=filename, user_id=user_id)
        db.session.add(new_file)
        db.session.commit()

        return jsonify({'message': 'File uploaded successfully'}), 201
    else:
        return error_response(400, 'No file provided')


@app.route('/download/<file_id>', methods=['GET'])
def download_file(file_id):
    file = File.query.get(file_id)
    if file:
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'], file.filename), as_attachment=True)
    else:
        return error_response(404, 'File not found')

 
if __name__ == "__main__":
    upload_folder = 'uploads'
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    app.config['UPLOAD_FOLDER'] = upload_folder
    app.run(debug=True)