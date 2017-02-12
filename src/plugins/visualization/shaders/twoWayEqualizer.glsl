precision mediump float;

uniform sampler2D u_texture;
varying vec4 screen_position;

void main() {
  float x = 0.5 * screen_position.x + 0.5;
  float power = texture2D(u_texture, vec2(x, 0)).a;
  if (power > abs(screen_position.y)) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = vec4(0, 0, 0, 0);
  }
}
