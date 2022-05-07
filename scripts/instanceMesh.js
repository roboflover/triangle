import Stats from './lib/stats.module.js';
//import * as THREE from './lib/three.module.js';
import {OrbitControls} from './lib/OrbitControls.js'
import { GUI } from './lib/lil-gui.module.min.js';

let camera, scene, renderer, controls;
let mesh; 
let stats;
let gui;
let particlesCount = 200;
let meshParametrs = {
  diametr: [],
  position: []
}

init();
animate(0);

function init() {

  scene = new THREE.Scene();
  
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 100
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  
	window.addEventListener( 'resize', onWindowResize ); 

  stats = new Stats();
  document.body.appendChild( stats.dom );

  addGeometry()
  initGui();
  

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function createTestMesh(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
  const mesh = new THREE.InstancedMesh( geometry, material, particlesCount );
  return mesh;
}

function instanceDataGenerator(transform, posXArray, posYArray, scaleXArray)  {
     // сгенерировать точку
     transform.position.random().subScalar( 0.50).multiplyScalar( 70 );
     transform.position.z = 0;
     transform.rotation.x = Math.random() * Math.PI;
     transform.rotation.y = Math.random() * Math.PI;
     transform.rotation.z = Math.random() * Math.PI;
     // сгенерировать размер
     transform.scale.x = Math.random() * Math.PI * 1;
     transform.scale.y = transform.scale.x;
     transform.scale.z = transform.scale.x;
     posXArray.push(Math.abs(transform.position.x));
     posYArray.push(Math.abs(transform.position.y));
     scaleXArray.push(transform.scale.x); 
}

function chekPosAndSize(transformXPos, transformYPos, arrayX, arrayY, scale, scaleArr) {
  for(let i = 0; i < arrayX.length; i++) {
    if(transformXPos < arrayX[i] && transformYPos < arrayY[i]){
      if(scale < scaleArr[i]) {
        return true;
      } return false;
    } return false;
  }
}

function addGeometry() {

  mesh = createTestMesh()
  scene.add(mesh);



  const transform = new THREE.Object3D();
  let posXArray = [];
  let posYArray = [];
  let scaleXArray = [];
  for ( let i = 0; i < particlesCount; i ++ ) {

    instanceDataGenerator(transform, posXArray, posYArray, scaleXArray);     
    //console.log(Math.abs(transform.position.x - posXArray[i] ))
    for ( let t = 0; t < posXArray.length*5; t ++ ) {
      const cheker = chekPosAndSize(transform.position.x, transform.position.y, posXArray, posYArray, transform.scale.x, scaleXArray)
      console.log(cheker);
      if(cheker){
        transform.updateMatrix();
        mesh.setMatrixAt( i, transform.matrix );
      } break;
    } 
    
    // instanceDataGenerator(transform, posXArray, scaleXArray); 
    // проверить нет ли рядом других точек
    // если расстояние и дистация больше радиуса точки

    // если есть тогда проходим заново     

  }
  //console.log(posXArray)
  // console.log(transform.matrix.elements)
  console.log(transform.position.x);

}

function removeGeometry() {

  scene.remove(mesh);

}

function createMatrixMesh() {
  removeGeometry()
  addGeometry()
}


scene.add( mesh );

function animate(dt) {

  requestAnimationFrame( animate ); 
  
  dt = dt * 0.001;
  
	renderer.render( scene, camera );
  controls.update();
  stats.update();

}

function initGui() {

  gui = new GUI();

  const param = {
    'count': particlesCount
  };

  gui.add( param, 'count', 1, 1000 ).onChange( function ( val ) {

    particlesCount = val;
    createMatrixMesh()
  } );
}
