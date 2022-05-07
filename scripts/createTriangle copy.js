// import Stats from './lib/stats.module.js';
// import * as THREE from './lib/three.module.js';
//import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.module.js';

// import THREE from './lib/three.js';
// import {OrbitControls} from './lib/OrbitControls.js'
// import { GUI } from './lib/lil-gui.module.min.js';
// import { MeshSurfaceSampler } from './lib/MeshSurfaceSampler.js';
// import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
// import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js'
// import { GUI } from 'https://threejs.org/examples/jsm/libs/lil-gui.module.min.js';

let camera, scene, renderer, controls;
let enemies = [];
let timeElapsed;
let triangleMesh, tubeMesh, triangleGroup, triangle;
let meshBackground;
let spawnNum;
let particleSystem, uniforms;
let triangleSize;

function init() {

  scene = new THREE.Scene();
  
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 10
  
  triangle = new THREE.Group();
	scene.add( triangle );  

  triangleGroup = new THREE.Group();
	scene.add( triangleGroup );
  
  function createTriangle (triangleSize) {
   
    let pointA;  
    let pointB;  
    let pointC;
    
    const geoTriangle = new THREE.ConeGeometry( triangleSize, 0, 3 );
    const matTriangle = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true } );
    const meshTriangle = new THREE.Mesh( geoTriangle, matTriangle );
    meshTriangle.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));  
    
    let trianglePoints = meshTriangle.geometry.vertices;

    pointA = new THREE.Vector3(0, 0, 2);
    pointB = new THREE.Vector3(1.7320507764816284, 0, -1);
    pointC = new THREE.Vector3(-1.7320507764816284, 0, -1); 
    
    meshTriangle.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(270)));  
    
    meshTriangle.scale.x = meshTriangle.scale.x * .7;
    meshTriangle.scale.y = meshTriangle.scale.y * .7;
    meshTriangle.scale.z = meshTriangle.scale.z * .7;
    
    triangleGroup.add(meshTriangle)
    
    const material = new THREE.MeshBasicMaterial({ color: 0x5B5B5B });    
    const directionA = new THREE.Vector3().subVectors(pointB, pointA);
    const geometryA = new THREE.CylinderGeometry(0.1, 0.1, directionA.length(), 6, 4, true);
    geometryA.applyMatrix4(new THREE.Matrix4().makeTranslation(0, directionA.length() / 2, 0));
    geometryA.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));
    const meshA = new THREE.Mesh(geometryA, material);

    const directionB = new THREE.Vector3().subVectors(pointB, pointC);
    const geometryB = new THREE.CylinderGeometry(0.1, 0.1, directionB.length(), 6, 4, true);
    geometryB.applyMatrix4(new THREE.Matrix4().makeTranslation(0, directionB.length() / 2, 0));
    geometryB.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));
    const meshB = new THREE.Mesh(geometryB, material); 

    const directionC = new THREE.Vector3().subVectors(pointC, pointA);
    const geometryC = new THREE.CylinderGeometry(0.1, 0.1, directionC.length(), 6, 4, true);
    geometryC.applyMatrix4(new THREE.Matrix4().makeTranslation(0, directionC.length() / 2, 0));
    geometryC.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));
    const meshC = new THREE.Mesh(geometryC, material);

    meshA.position.copy(pointA);
    meshA.lookAt(pointB);   

    meshB.position.copy(pointB);
    meshB.lookAt(pointC);   

    meshC.position.copy(pointC);
    meshC.lookAt(pointA);    

    triangleGroup.add(meshA);
    triangleGroup.add(meshB);
    triangleGroup.add(meshC);

    const geoBall = new THREE.SphereGeometry( .2, 32, 16 );
    const matBall = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true } );

    const ballA = new THREE.Mesh( geoBall, matBall );
    const ballB = new THREE.Mesh( geoBall, matBall );
    const ballC = new THREE.Mesh( geoBall, matBall );

    ballA.position.copy(pointA);
    ballB.position.copy(pointB);
    ballC.position.copy(pointC);

    triangleGroup.add(ballA);  
    triangleGroup.add(ballB);
    triangleGroup.add(ballC);     
    
    triangleGroup.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));
    triangleGroup.applyMatrix4(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(0)));
    triangleGroup.applyMatrix4(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(180)));

    
}
  let triangleSizeInit = 2;
  createTriangle(triangleSizeInit);  

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  // controls.autoRotate = true;
  
	window.addEventListener( 'resize', onWindowResize ); 

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

timeElapsed = 0;
spawnNum = [0, 0, 0];

function animate(dt) {

	requestAnimationFrame( animate );

	// triangleMesh.rotation.x += 0.005;
	// triangleMesh.rotation.y += 0.01;

	renderer.render( scene, camera );
  controls.update();

}

init();
animate(0);
