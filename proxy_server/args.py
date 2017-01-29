import argparse

parser = argparse.ArgumentParser(
  description='Process some integers.',
)

parser.add_argument('--port', default=5000)

arguments = None

def parse():
  global arguments
  arguments = parser.parse_args()
