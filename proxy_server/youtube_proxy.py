import pafy

from app import app

from flask import Response


@app.route('/youtube/<string:track>', methods=['GET'])
def youtube_proxy(track):
  url = 'https://www.youtube.com/watch?v={}'.format(track)
  video = pafy.new(url)
  audiostream = video.getbestaudio()

  def generate():
    audiostream.download('audio.tmp', quiet=True)
    with open("audio.tmp", "rb") as audiofile:
      with app.test_request_context():
        from flask import request
        range_ = request.headers.get('Range')
        if range_:
          range_ = range_.split('=')[1][:-1]
          audiofile.seek(range_)
      data = audiofile.read(1024)
      while data:
        yield data
        data = audiofile.read(1024)

  return Response(
    generate(),
    mimetype='audio/{}'.format(audiostream.extension),
    headers={
      'Accept-Ranges': 'bytes',
    },
  )
