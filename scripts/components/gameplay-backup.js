import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';
import { init } from './init.js';
import {  camera, scene, renderer, controls } from './init.js';

let enemies = [];
let timeElapsed;
let meshPlayer;
let spawnNum;
let tooglePulse = false;
let keyMultiplier = 0.00051;

function createPlayer() {
    const geometry = new THREE.BoxGeometry( 10, 10, 10 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ccff } );
    const mesh = new THREE.Mesh( geometry, material );
    return mesh;
} meshPlayer = createPlayer();

scene.add( meshPlayer );

function createEnemy(){
	const geometry = new THREE.BoxGeometry( 10, 10, 10 );
	const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );		
	const mesh = new THREE.Mesh( geometry, material );
	return mesh;
} 

function addEnemies(){
	const newEnemy = createEnemy();
	newEnemy.position.x = 200;
	enemies.push(newEnemy);
	scene.add(newEnemy);
}

function moveEnemies() {
	for(let i = 0; i < enemies.length; i++){
		let speed = -1;
		enemies[i].position.x += speed;
		if (enemies[i].position.x <= -100){
			scene.remove(enemies[i]); 
		}
	} 
}

timeElapsed = 0;
spawnNum = [0, 0, 0];

function enemySpawner(){

   if(timeElapsed >= 50){

    let rand = Math.ceil(Math.random() * 2)-1;
    if (rand) {
      addEnemies();
    }
    tooglePulse = true;
    timeElapsed = 0;
  }
  timeElapsed++;

}




function animate(dt) {

  requestAnimationFrame( animate );

  function eventMode(event) {
    if (['W','w', 'ArrowUp'].includes(event.key) ) {     
        moveUp();
    } else if (['S','s', 'ArrowDown'].includes(event.key) ) {   
        moveDown();
    }
  }
  
  function moveUp () {
    meshPlayer.position.y += keyMultiplier;
  }

  function moveDown () {
    meshPlayer.position.y -= keyMultiplier;
  }

  document.addEventListener('keydown', eventMode);
  //document.removeEventListener('keydown', eventMode);
  if (tooglePulse){
    document.removeEventListener('keydown', eventMode);
    tooglePulse = false;
  }

  enemySpawner();
  moveEnemies();
//   console.log(tooglePulse);
  meshPlayer.rotation.x += 0.005;
  meshPlayer.rotation.y += 0.01;


  renderer.render( scene, camera );

}

animate(0);

