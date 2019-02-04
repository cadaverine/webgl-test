function start() {
  const canvas = document.getElementById('gl-canvas');
  const gl = canvas.getContext('webgl');

  if (gl != null) {
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);    
  }
}