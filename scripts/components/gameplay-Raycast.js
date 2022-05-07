import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';
import { init } from './init.js';
import {  camera, scene, renderer, controls } from './init.js';
import { HeroCreator } from './HeroCreator.js';
import { EnemySpawner } from './EnemySpawner.js';

const newHero = new HeroCreator();
const player = newHero.renderHero('player');
const directionForward = new THREE.Vector3(1, 0, 0);
const directionUp = new THREE.Vector3(0, 1, 0);
const directionDown = new THREE.Vector3(0, -1, 0);
const rayForward = new THREE.Raycaster(player.position, directionForward);
const rayUp = new THREE.Raycaster(player.position, directionUp);
const rayDown = new THREE.Raycaster(player.position, directionDown);


let heroes = [];
let tooglePulse = false;
let numberSpawner = 0;
let timeElapsed = 0;
let start = 1;
let speed;
let brickColisionX = false;
let brickColisionYDown = false;
let brickColisionYUp = false;
let wallCollision = false;
let colisionBrickX = [];
let colisionBrickYDown = [];
let colisionBrickYUp = [];



scene.add( player );

function heroSelection(type){
    // Math.ceil(Math.random() * 2)-1;
    let mesh;
    if (type === 'bonus'){
        mesh = newHero.renderHero('bonus');
        return mesh;
    } else if (type === 'enemy') {
        mesh = newHero.renderHero('enemy');
        return mesh;
    } else if (type === 'brick') {
        mesh = newHero.renderHero('brick');
        return mesh;
    }
}

function addHero(positionY, type){
	const newHero = heroSelection(type);
    newHero.index = positionY;	
	newHero.position.x = window.innerWidth / 17;
    newHero.type = type;
	heroes.push(newHero);
}

function chekVerticalPlayerCount() {
    let mshPos = player.position.y;
     if(mshPos !== -50
        || mshPos !== -25
        || mshPos !== 0
        || mshPos !== 25
        || mshPos !== 50 ) {
            return false;
        } else {
            return true;
        }
}

function chekColision() {
    // rayUp
    rayForward.far = 5;
    let rayArrayBrickForward = rayForward.intersectObjects(heroes);

    for(let i = 0; i < rayArrayBrickForward.length; i++) {

        if(rayArrayBrickForward[i].object.name === 'brick'){
            brickColisionX = true;
            console.log(rayArrayBrickForward[i].object)
            console.log('впереди препятсвие')
        }
    }
    
    let rayArrayBrickDown = rayDown.intersectObjects(heroes);

    for(let i = 0; i < rayArrayBrickDown.length; i++) {

        if(rayArrayBrickDown[i].object.name === 'brick'){
            console.log('засек нижнего зеленого')
            brickColisionYDown = true;
        } 
    }

    if(rayArrayBrickDown.length <= 0) {
        console.log('внизу чисто, можно ехать')
        brickColisionYDown = false;
    }
    // let rayArrayBrickUp = rayUp.intersectObjects(heroes);

    // for(let i = 0; i < rayArrayBrickUp.length; i++) {

    //     if(rayArrayBrickUp[i].object.name === 'brick'){
    //         brickColisionX = true;
    //     }
    // }

    rayForward.far = 1;
    let rayArrayBonus = rayForward.intersectObjects(heroes);

    for(let i = 0; i < rayArrayBonus.length; i++) {

        if(rayArrayBonus[i].object.name === 'bonus'){
            scene.remove(rayArrayBonus[i].object)
        }
    }
    
    if(rayArrayBonus.length === 0) {
        brickColisionX = false;
    }

}

function moveEnemies() {
	for(let i = 0; i < heroes.length; i++){
		if (heroes[i].index === 0){
			heroes[i].position.y = -50;
		} else if (heroes[i].index === 1){
			heroes[i].position.y = -25;
		} else if (heroes[i].index === 2){
			heroes[i].position.y = 0;
		} else if (heroes[i].index === 3){
			heroes[i].position.y = 25;
		} else if (heroes[i].index === 4){
			heroes[i].position.y = 50;
		}      
        
        if(!brickColisionX){
        speed = -1;
        heroes[i].position.x += speed;            
        } else {
            speed = 0;
        }

        scene.add(heroes[i]);       
        if(!heroes[i]) {
            continue
        } else if (heroes[i].position.x <= -60) {
            scene.remove(heroes[i]); 
            heroes.splice(i, 1);    
        }
	} 
    chekColision();
}

function enemySpawner(){

    const data = {
        numberSpawnerLimit: 0,
        timeLoopCount: 25 
    }
    if(start === 1){
        data.numberSpawnerLimit = 1;
        data.timeLoop = 25;
        data.placements = [0, 4];
        data.type = ['enemy', 'enemy'];
        data.pause = 2;
        spawnGenerator(data);

    } else if(start === 2){
        data.numberSpawnerLimit = 1;
        data.timeLoop = 25;
        data.placements = [1, 2, 3];
        data.type = ['bonus', 'enemy', 'bonus'];
        data.pause = 3;
        spawnGenerator(data);

    } else if(start === 3){
        data.numberSpawnerLimit = 4;
        data.timeLoop = 25;
        data.placements = [0, 1, 2 ];
        data.type = ['brick', 'brick', 'enemy' ];
        data.pause = 1;
        spawnGenerator(data);

    }  else if(start === 4){
        data.numberSpawnerLimit = 4;
        data.timeLoop = 25;
        data.placements = [4, 3 ];
        data.type = ['brick', 'brick' ];
        data.pause = 1;
        spawnGenerator(data);

    } else {
        start = 1;
    }

    removingEnemies();
    
}

function removingEnemies() {
    if (heroes.length > 20 ) {
        heroes.pop();
    }

    if (colisionBrickX.length > 20 ) {
        colisionBrickX.pop();
    }

}

function spawnGenerator(data) {

    if(!brickColisionX) {
        if(timeElapsed >= data.timeLoop && numberSpawner < data.numberSpawnerLimit && data.placements){
            
            for(let i = 0; i < data.placements.length; i++) {
                addHero(data.placements[i], data.type[i]);
            }
        numberSpawner++;
        timeElapsed = 0;

        } else if (timeElapsed >= (data.timeLoop * data.pause) && numberSpawner === data.numberSpawnerLimit) {

        numberSpawner = 0;
        start++;
    } else {
        timeElapsed++;
    }        
    }

   
}

function eventMode(event) {
    const keyStep = 25;
    const upperPlank = 50;
    //if(!brickColision) {
        if (['W','w', 'ArrowUp'].includes(event.key) && !brickColisionYUp) {       
            moveUp(keyStep, upperPlank);
        } else if (['S','s', 'ArrowDown'].includes(event.key) && !brickColisionYDown) {   
            moveDown(keyStep, upperPlank);
        }        
    //}

  }
  

function moveUp (keyStep, upperPlank) {
    if(player.position.y !== upperPlank){
        player.position.y += keyStep;
    } else {
        player.position.y = upperPlank;
    }
}

function moveDown (keyStep, upperPlank) {
    if(player.position.y !== -upperPlank){
        player.position.y -= keyStep;
    } else {
        player.position.y = -upperPlank;
    }
}



function animate(dt) {

  requestAnimationFrame( animate );

  document.addEventListener('keydown', eventMode);

  if (tooglePulse){
    document.removeEventListener('keydown', eventMode);
    tooglePulse = false;
  }

  enemySpawner();
  moveEnemies();

  player.rotation.x += 0.005;
  player.rotation.y += 0.01;

  renderer.render( scene, camera );

}

animate(0);
