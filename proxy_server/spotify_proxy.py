import threading
from queue import Queue
import wave
import io
import time

import spotify

from app import app
import args

from flask import Response

args.parser.add_argument('--spotify-login', dest='spotify_login')
args.parser.add_argument('--spotify-password', dest='spotify_password')

spotify_session = spotify.Session()

logged_in_event = threading.Event()

def init():
  login = args.arguments.spotify_login
  password = args.arguments.spotify_password

  if login and password:
    loop = spotify.EventLoop(spotify_session)
    loop.start()

    spotify_session.login(
      args.arguments.spotify_login,
      args.arguments.spotify_password,
    )


def connection_state_listener(session):
  if session.connection.state is spotify.ConnectionState.LOGGED_IN:
    logged_in_event.set()
    app.logger.info('spotify logged in')
  else:
    app.logger.warn('spotify failed to log in')

spotify_session.on(
  spotify.SessionEvent.CONNECTION_STATE_UPDATED,
  connection_state_listener,
)

is_end = threading.Event()
frames_queue = Queue()

wav = None


def on_delivery(session, audio_format, frames, num_frames):
  wav.writeframesraw(frames)
  return num_frames


def on_end(*args):
  app.logger.info('end')
  is_end.set()

spotify_session.on(
  spotify.SessionEvent.MUSIC_DELIVERY,
  on_delivery,
)
spotify_session.on(
  spotify.SessionEvent.END_OF_TRACK,
  on_end,
)


@app.route('/spotify/<string:track>', methods=['GET'])
def spotify_proxy(track):
  global wav

  if not logged_in_event.is_set():
    return Response('Spotify not logged in', status=401)

  is_end.clear()
  frame_size = 2
  frame_number = None
  buffer = io.BytesIO()
  wav = wave.open(buffer, 'wb')
  wav.setparams((2, 2, 44100, 0, 'NONE', 'not compressed'))
  pointer = 0
  spotify_session.player.play(False)
  try:
    track = spotify_session.get_track(track).load()
    frame_number = int(track.duration / 1000 * 44100)
    wav.setnframes(frame_number)
    spotify_session.player.load(track)
    spotify_session.player.play()
  except Exception as e:
    app.logger.error(str(e))
    return Response(str(e), status=500)

  def generate():
    nonlocal pointer
    while not is_end.is_set() or pointer < buffer.tell():
      buffer_pointer = buffer.tell()
      if pointer < buffer_pointer:
        buffer.seek(pointer)
        data = buffer.read()
        yield data
        buffer.seek(buffer_pointer)
        pointer = buffer_pointer
      time.sleep(0.01)

  content_size = frame_number * frame_size * 2

  return Response(
    generate(),
    mimetype='audio/wav',
    # status=206,
    headers={
      'Accept-Ranges': 'bytes',
      'Content-Length': content_size,
      'Content-Range': 'bytes 0-{}/{}'.format(
        content_size, content_size - 1,
      ),
    },
  )
