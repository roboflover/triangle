// import Stats from './lib/stats.module.js';
import * as THREE from './lib/three.module.js';
import {OrbitControls} from './lib/OrbitControls.js'

let camera, scene, renderer, controls;
let enemies = [];
let timeElapsed;
let triangleMesh, tubeMesh, triangleGroup, triangle;
let meshBackground;
let spawnNum;
let particleSystem, uniforms;
let triangleSize;
let arrayA = [];
let arrayNumberGrid = 6;
let time;
let arrCount
let meshGrid;

const objectWave = {
 time: 0 
}

init();
animate(0);

function init() {

  scene = new THREE.Scene();
  
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 10
  
  triangle = new THREE.Group();
	scene.add( triangle );  

  triangleGroup = new THREE.Group();
	scene.add( triangleGroup );

  meshGrid = createPlane();
  scene.add(meshGrid);
  arrCount = 6 * 3; //meshGrid.geometry.attributes.position.array.length;

  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  
	window.addEventListener( 'resize', onWindowResize ); 

  const geoTriangle = new THREE.ConeGeometry( triangleSize, 0, 3 );
  const matTriangle = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true } );
  const meshTriangle = new THREE.Mesh( geoTriangle, matTriangle );
  meshTriangle.geometry.verticesNeedUpdate = true;
  console.log(meshTriangle);
  scene.add(meshTriangle);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function createPlane() {
   
    const geometry = new THREE.PlaneGeometry( 5, 5, 5, 5 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    const circle = new THREE.Mesh( geometry, material );
    return circle;    
    
}

timeElapsed = 0;
spawnNum = [0, 0, 0];

function animate(dt) {

  objectWave.time = time;
  time = Math.sin(dt * 0.001);
  // console.log(time);
  // for (let i = 0; i < arrCount; i++) {
  //   meshGrid.geometry.attributes.position.array[i+=2] *= dt;
  // }
 
  requestAnimationFrame( animate );

	renderer.render( scene, camera );
  controls.update();

}




