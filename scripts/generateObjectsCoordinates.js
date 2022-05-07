import Stats from './lib/stats.module.js';
import * as THREE from './lib/three.module.js';
import {OrbitControls} from './lib/OrbitControls.js'
import { GUI } from './lib/lil-gui.module.min.js';
// // import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
// import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js'
// import { GUI } from 'https://threejs.org/examples/jsm/libs/lil-gui.module.min.js';

let camera, scene, renderer, controls;

init();
animate(0);

function init() {

  scene = new THREE.Scene();
  
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 25
  camera.position.x = 10
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  
	window.addEventListener( 'resize', onWindowResize ); 

  addStartScene()

}

function distanceMeter (x1, x2, y1, y2){
  
  const a = x1 - x2;
  const b = y1 - y2;
  const c = Math.sqrt( a*a + b*b );

  return c;
}

function generateObjectsCoordinates () {
  
  let numberOfGeometries = 500;
  let newData = [];
  let powerData = [];

  for(let i = 0; i < numberOfGeometries; i++){
    
    let objArr = {x: 0, y: 0, scale: 0};
    let disMultiplier;
    let sizeMultiplier;
    let halfNumber = numberOfGeometries / 1;
    let lengthArray = newData.length;
    

    objArr.x = Math.random() * 10;
    objArr.y = Math.random() * 10;
    objArr.scale = Math.random() * 1;

    newData[i] = objArr;
    
    if(i > 1 && i < halfNumber){

      for(let c = 0; c < lengthArray; c+=1 ){
        
        disMultiplier = 1.5;
        sizeMultiplier = 1.3;
        const distance = distanceMeter(newData[i].x, newData[c].x, newData[i].y, newData[c].y) * disMultiplier;
        const size = (newData[i].scale + newData[c].scale) * sizeMultiplier;
        
        if((distance - size > (size * 1.4)) && (distance - size < (size * 2.3))) {         
          powerData.push(newData[i]);
          //createTestMesh(newData[i]);
          newData[i] = newData[i].avatarka = true;
          
         }  else {
          lengthArray = lengthArray + 1; 
          newData[i] = newData[i].avatarka = false;
          
        }  break;
        //newData[c] = newData.filter(value => value[c].avatarka = true);
      }

    }   
    
  }
powerData.forEach(callbackFunc);
function callbackFunc(name, idx, arr){
  // console.log(name, idx, arr);
  createTestMesh(powerData[idx]);
}
console.log(powerData);

}





function createTestMesh(pos){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true } ); 
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = pos.x;
  mesh.position.y = pos.y;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = pos.scale; 
  scene.add( mesh );
}

function createPlane(){
  const geometry = new THREE.PlaneGeometry( 10, 10, 10, 10 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true } ); 
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = 5;
  mesh.position.y = 5;
  scene.add( mesh );
}

function addStartScene(){
  createPlane();
  
  generateObjectsCoordinates();

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

