import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';
import { DoubleSide } from 'three';

let camera, scene, renderer, controls;
let sampler;
let scatterMesh, scatterGeo, scatterMat;
let positionArray = [];
let _newPosition = new THREE.Vector3();

const api = {

  count: 5000,
  distribution: 'random',
  surfaceColor: 0xFFF784,
  surfaceSize: 20,
  backgroundColor: 0xE39469,
  size: 1,
  factor: 1.2,
  numberOfPoints: 0

};

  const vertices = [
     0.0,  0.0,  2.0,
     1.7320507764816284,  0.0,  -1.0,
    -1.7320507764816284, 0.0,  -1.0
  ];

const surfaceGeometry = new THREE.SphereGeometry( api.surfaceSize, 50, 50 ).toNonIndexed();
const surfaceMaterial = new THREE.MeshBasicMaterial( {color: api.backgroundColor, wireframe: true, side: THREE.DoubleSide } ); 
// Source: https://gist.github.com/gre/1650294
const easeOutCubic = function ( t ) {

  return ( -- t ) * t * t + 1;

};
// Scaling curve causes particles to grow quickly, ease gradually into full scale, then
// disappear quickly. More of the particle's lifetime is spent around full scale.
const scaleCurve = function ( t ) {

  return Math.abs( easeOutCubic( ( t > 0.5 ? 1 - t : t ) * 2 ) );

};

function createMesh(vertices) {

  const verticesF32 = new Float32Array(vertices); 
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.BufferAttribute( verticesF32, 3 ) );
  const material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: DoubleSide } );
  const mesh = new THREE.Mesh( geometry, material );
  scene.add(mesh)
}

function createLine(vertices) {

  let verticesPush = vertices; 
  verticesPush.push(vertices[0], vertices[1], vertices[2]);
  const verticesF32 = new Float32Array(vertices); 
  const geometry = new THREE.BufferGeometry();  
  geometry.setAttribute( 'position', new THREE.BufferAttribute( verticesF32, 3 ) );
  const material = new THREE.LineBasicMaterial( { color: 0x115500 } )
  let line = new THREE.Line( geometry, material );
  line.scale.x = line.scale.y = line.scale.z = 1.2  
  scene.add(line)
}

function createSpheres(vertices) {

  const count = vertices.length / 3;
  const geometry = new THREE.IcosahedronGeometry( 0.1, 3 );
  const material = new THREE.MeshBasicMaterial( { color: 0xff0110, side: DoubleSide } );
  const mesh = new THREE.InstancedMesh( geometry, material, count * 3 )
  const matrix = new THREE.Matrix4();
  matrix.needsUpdate = true;
  for(let i = 0, i3 = 0; i < count; i++, i3 += 3){
    let x = vertices[i3 + 0];
    let y = vertices[i3 + 1];
    let z = vertices[i3 + 2];
    matrix.setPosition( x, y, z );
    mesh.setMatrixAt( i3, matrix );
  }
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.2  
  scene.add(mesh)

}



init();
animate(0);
createMesh(vertices);
createLine(vertices);
createSpheres(vertices);

function init() {

  scene = new THREE.Scene();
  
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 1
  camera.position.y = 10
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  
	window.addEventListener( 'resize', onWindowResize ); 

  startScene()

}

function startScene(){
  

}

function onWindowResize() {
  
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
  
}

function animate(dt) {

  requestAnimationFrame( animate ); 
  
  dt = dt * 0.001;

	renderer.render( scene, camera );
  controls.update();

}