attribute vec4 a_position;

varying vec4 screen_position;

void main() {
  gl_Position = a_position;
  screen_position = a_position;
}
