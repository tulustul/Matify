precision mediump float;

uniform sampler2D u_texture;
varying vec4 screen_position;

void main() {
  float x = 1.0 - abs(screen_position.x);
  float power = texture2D(u_texture, vec2(x, 0)).a;
  if (power > abs(screen_position.y)) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = vec4(0, 0, 0, 0);
  }
}
