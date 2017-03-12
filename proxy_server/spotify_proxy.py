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

audio_format = None

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
track = None
buffer = None


def on_delivery(session, new_audio_format, frames, num_frames):
  global audio_format
  global track
  global wav
  global buffer

  if not wav:
    audio_format = new_audio_format
    wav = wave.open(buffer, 'wb')
    wav.setparams((
      audio_format.channels, 2, audio_format.sample_rate,
      0, 'NONE', 'not compressed',
    ))
    frame_number = track.duration // 1000 * audio_format.sample_rate
    wav.setnframes(frame_number)

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


@app.route('/spotify/<string:track_key>', methods=['GET'])
def spotify_proxy(track_key):
  global wav
  global track
  global buffer

  frame_size = 2
  frame_number = None

  if not logged_in_event.is_set():
    return Response('Spotify not logged in', status=401)

  from flask import request
  range_ = request.headers.get('Range')

  range_in_bytes = 0
  if range_:
    try:
      range_in_bytes = int(range_.split('=')[1].split('-')[0])
    except ValueError:
      range_in_bytes = 0
    # position = range_in_bytes * 1000 // audio_format.sample_rate // audio_format.frame_size() // audio_format.channels
    position = range_in_bytes * 1000 // 44100 // 4 // 2
  else:
    position = 0

  # is_end.set()
  # time.sleep(0.02)

  is_end.clear()
  buffer = io.BytesIO()
  wav = None
  pointer = 0
  spotify_session.player.play(False)
  try:
    track = spotify_session.get_track(track_key).load()
    # frame_number = track.duration // 1000 * audio_format.sample_rate
    # wav.setnframes(frame_number)
    spotify_session.player.load(track)
    if position:
      spotify_session.player.seek(position)
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

  # content_size = track.duration // 1000 * audio_format.sample_rate * frame_size * 2
  content_size = track.duration // 1000 * 44100 * 4 * 2

  return Response(
    generate(),
    mimetype='audio/wav',
    status=206,
    headers={
      'Accept-Ranges': 'bytes',
      'Content-Length': content_size - range_in_bytes - 20,
      'Content-Range': 'bytes {}-{}/{}'.format(
        range_in_bytes, content_size, content_size + 1,
      ),
    },
  )
