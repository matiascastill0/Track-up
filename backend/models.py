from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from uuid import uuid4

db = SQLAlchemy()
migrate = Migrate()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(36), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)
    # Relaciones
    songs = db.relationship('Song', backref='user', lazy=True)
    playlists = db.relationship('Playlist', backref='user', lazy=True)

class Song(db.Model):
    __tablename__ = "songs"
    id = db.Column(db.String(36), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    about = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    artist_id = db.Column(db.String(36), db.ForeignKey('artists.id'), nullable=True)  # Add this line


class Playlist(db.Model):
    __tablename__ = "playlists"
    id = db.Column(db.String(36), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    about = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    # Tabla asociativa para la relación muchos a muchos entre Playlist y Song
    songs = db.relationship('Song', secondary='playlist_song', lazy='subquery',
                            backref=db.backref('playlists', lazy=True))
                            

class Artist(db.Model):
    __tablename__ = "artists"
    id = db.Column(db.String(36), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    # Relaciones
    songs = db.relationship('Song', backref='artist', lazy=True)

class File(db.Model):
    __tablename__ = "files"
    id = db.Column(db.String(36), primary_key=True, unique=True, default=get_uuid)
    filename = db.Column(db.String(255), nullable=False)
    # Relaciones
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    song_id = db.Column(db.String(36), db.ForeignKey('songs.id'), nullable=True)
    artist_id = db.Column(db.String(36), db.ForeignKey('artists.id'), nullable=True)

playlist_song = db.Table('playlist_song',
    db.Column('playlist_id', db.String(36), db.ForeignKey('playlists.id'), primary_key=True),
    db.Column('song_id', db.String(36), db.ForeignKey('songs.id'), primary_key=True)
)
