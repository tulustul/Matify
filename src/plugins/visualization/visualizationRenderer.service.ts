import * as fs from 'fs';

export class VisualizationRenderer {

  private vsSource: string;

  private fsSource: string;

  private tex: WebGLTexture;

  private ctx: WebGLRenderingContext;

  private vs: WebGLShader;

  private fs: WebGLShader;

  private program: WebGLProgram;

  private VERTICES = [
    -1, -1,
    -1, 1,
    1, -1,

    -1, 1,
    1, -1,
    1, 1,
  ];

  public async init(canvas: HTMLCanvasElement) {

    this.ctx = canvas.getContext('webgl');

    this.vsSource = await this.loadShader(
      'src/plugins/visualization/shaders/vs.glsl',
    );

    this.main();
  }

  public requestFrame(data: Uint8Array) {
    requestAnimationFrame(() => this.draw(data));
  }

  public async setShader(fsPath) {
    if (this.fs) {
      this.ctx.deleteShader(this.fs);
    }
    this.fs = this.createShader(
      this.ctx.FRAGMENT_SHADER,
      await this.loadShader(fsPath),
    );

    if (this.program) {
      this.ctx.deleteProgram(this.program);
    }
    this.program = this.createProgram(this.vs, this.fs);

    this.ctx.useProgram(this.program);

    let posLocation = this.ctx.getAttribLocation(this.program, 'a_position');
    this.ctx.enableVertexAttribArray(posLocation);
    this.ctx.vertexAttribPointer(posLocation, 2, this.ctx.FLOAT, false, 0, 0);
  }

  private loadShader(shaderPath: string) {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(shaderPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Unable to load ${shaderPath}`);
          reject();
        } else {
          resolve(data);
        }
      });
    });
  }

  private createShader(type: number, source: string) {
    let shader = this.ctx.createShader(type);
    this.ctx.shaderSource(shader, source);
    this.ctx.compileShader(shader);
    let success = this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS);
    if (success) {
      return shader;
    } else {
      let log = this.ctx.getShaderInfoLog(shader);
      console.error(`Shader compilation error: ${log}`);
      this.ctx.deleteShader(shader);
      return null;
    }
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ) {
    let program = this.ctx.createProgram();
    this.ctx.attachShader(program, vertexShader);
    this.ctx.attachShader(program, fragmentShader);
    this.ctx.linkProgram(program);
    let success = this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS);
    if (success) {
      return program;
    } else {
      this.ctx.deleteProgram(program);
    }

  }

  private main() {
    if (!this.ctx) {
      return;
    }

    this.vs = this.createShader(this.ctx.VERTEX_SHADER, this.vsSource);

    let positionBuffer = this.ctx.createBuffer();

    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, positionBuffer);
    this.ctx.bufferData(
      this.ctx.ARRAY_BUFFER,
      new Float32Array(this.VERTICES),
      this.ctx.STATIC_DRAW,
    );

    this.tex = this.ctx.createTexture();
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.tex);

    this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_WRAP_S,
      this.ctx.CLAMP_TO_EDGE,
    );
    this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_WRAP_T,
      this.ctx.CLAMP_TO_EDGE,
    );

    this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public set dataInterpolation(enabled: boolean) {
    let textureFiltering = enabled ? this.ctx.LINEAR : this.ctx.NEAREST;
    this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_MIN_FILTER,
      textureFiltering,
    );
    this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_MAG_FILTER,
      textureFiltering,
    );
  }

  private draw(data: Uint8Array) {
    this.ctx.texImage2D(
      this.ctx.TEXTURE_2D, 0, this.ctx.ALPHA, data.length, 1, 0,
      this.ctx.ALPHA, this.ctx.UNSIGNED_BYTE, data,
    );

    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, this.VERTICES.length / 2);
  }
}
