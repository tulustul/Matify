precision mediump float;

uniform sampler2D u_texture;
varying vec4 screen_position;

#define M_PI 3.1415926535897932384626433832795

void main() {
  float pos = acos(dot(vec2(0, -1), normalize(screen_position.xy)));

  float power = texture2D(u_texture, vec2(pos / M_PI, 0)).a;
  float vecLength = length(vec2(screen_position.xy));
  if (vecLength < power) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = vec4(0, 0, 0, 0);
  }
}
