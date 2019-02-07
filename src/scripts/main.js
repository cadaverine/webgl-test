import '../style.css';
import Drawer from './Drawer';
import vertexShaderSource from '../shaders/vertex.glsl';
import fragmentShaderSource from '../shaders/fragment.glsl';


function start() {
  const canvas = document.getElementById('gl-canvas');
  const drawer = new Drawer(canvas);

  drawer.initShaderProgram(vertexShaderSource, fragmentShaderSource);
  drawer.initBuffers();
  drawer.drawScene();
}

start();