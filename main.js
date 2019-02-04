
class Drawer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl');
    this.canvas = canvas;

    if (this.gl != null) {
      this.gl.clearColor(0.0, 0.0, 0.0, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }


  initShaderProgram(vertexShaderSource, fragmentShaderSource) {
    const { gl } = this;
    const { VERTEX_SHADER, FRAGMENT_SHADER } = gl;

    const vertexShader = this.loadShader(VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.loadShader(FRAGMENT_SHADER, fragmentShaderSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };

    this.shaderProgram = shaderProgram;
  }


  initBuffers() {
    const { gl } = this;

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ];

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(positions),
      gl.STATIC_DRAW,
    );

    this.position = positionBuffer;
  }


  drawScene() {
    const { gl } = this;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(
      projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar,
    );

    const modelViewMatrix = mat4.create();

    mat4.translate(
      modelViewMatrix,
      modelViewMatrix,
      [-0.0, 0.0, -6.0],
    );

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition,
      );
    }

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );

    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }


  loadShader(type, source) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  }
}


const vertexShaderSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;


function start() {
  const canvas = document.getElementById('gl-canvas');
  const drawer = new Drawer(canvas);

  drawer.initShaderProgram(vertexShaderSource, fragmentShaderSource);
  drawer.initBuffers();
  drawer.drawScene();
}