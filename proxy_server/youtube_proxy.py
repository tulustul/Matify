import pafy

from flask import redirect

from app import app

@app.route('/youtube/<string:track>', methods=['GET'])
def youtube_proxy(track):
  url = 'https://www.youtube.com/watch?v={}'.format(track)
  video = pafy.new(url)
  return redirect(video.getbestaudio().url)
