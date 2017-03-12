#!/usr/bin/python3

import logging
from logging.handlers import RotatingFileHandler
import sys

from app import app
import args

import spotify_proxy
import youtube_proxy

if __name__ == '__main__':
  args.parse()

  handler = RotatingFileHandler(
    'proxy-server.log',
    maxBytes=10**6,
    backupCount=1,
  )

  formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
  )
  handler.setFormatter(formatter)

  app.logger.setLevel(logging.DEBUG)
  app.logger.addHandler(handler)

  werkzeug_logger = logging.getLogger('werkzeug')
  werkzeug_logger.addHandler(handler)

  app.logger.info(
    'running with params: {}'
    .format(' '.join(sys.argv[1:]))
  )

  spotify_proxy.init()

  try:
    app.run(port=args.arguments.port, threaded=True)
  except OSError as e:
    app.logger.error('Unable to start server: {}'.format(e))
  except Exception as e:
    app.logger.error('Unexpected error: {}'.format(e))
