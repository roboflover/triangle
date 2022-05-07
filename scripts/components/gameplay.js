import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';
import { init } from './init.js';
import {  camera, scene, renderer, controls } from './init.js';
import { HeroCreator } from './HeroCreator.js';
import { EnemySpawner } from './EnemySpawner.js';

const newHero = new HeroCreator();
const player = newHero.renderHero('player');
const directionX = new THREE.Vector3(1, 0, 0);

let heroes = [];
let tooglePulse = false;
let numberSpawner = 0;
let timeElapsed = 0;
let start = 1;
let speed;
let stopMachine = false;
let brickColisionYDown = false;
let brickColisionYUp = false;
let wallCollision = false;
let colisionBrickX = [];

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
    } else if (type === 'mason') {
        mesh = newHero.renderHero('mason');
        return mesh;
    }
}

function addHero(positionY, type){
    // math diapason spawn point
    const old_min = 240;
    const old_max = 1900;
    let old_range = old_max - old_min;
    const new_min = 100;
    const new_max = 200;
    let new_range = new_max - new_min;
    let converted = (((window.innerWidth - old_min) * new_range) / old_range) + new_min;

    const newHero = heroSelection(type);
    newHero.index = positionY;	
	newHero.position.x = converted;
    console.log(converted)
    newHero.name = type;
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

function chekColision(i) {
    const pointA = heroes[i].position;
    const pointB = player.position;
    const distanceX = pointA.distanceTo(pointB);   
    let collisionDistanceX = 4;  

    if(distanceX < collisionDistanceX && heroes[i].name === 'bonus' ) {
        heroes[i].health -= 100;
        if( heroes[i].health < 0){
            scene.remove(heroes[i]); 
            heroes.splice(i, 1); 
        }        
    } 
    else if (distanceX < collisionDistanceX && heroes[i].name === 'mason' ) {
        heroes[i].health -= 10;
        if( heroes[i].health < 0){
            scene.remove(heroes[i]); 
            heroes.splice(i, 1);
        } 
    } else if (distanceX < collisionDistanceX && heroes[i].name === 'enemy' ) {
        heroes[i].health -= 10;
        if( heroes[i].health < 0){
            stopMachine = true;
        } 
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
        
        if(!stopMachine){
        speed = -1;
        heroes[i].position.x += speed;            
        } else {
            speed = 0;
        }

        scene.add(heroes[i]);       
        chekColision(i, heroes[i]);
        if(!heroes[i]) {
            continue
        } else if (heroes[i].position.x <= -60) {
            scene.remove(heroes[i]); 
            heroes.splice(i, 1);    
        }
	} 
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
        data.type = ['mason', 'mason', 'enemy' ];
        data.pause = 1;
        spawnGenerator(data);

    }  else if(start === 4){
        data.numberSpawnerLimit = 4;
        data.timeLoop = 25;
        data.placements = [4, 3 ];
        data.type = ['mason', 'mason' ];
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

    if(!stopMachine) {
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
    if(!stopMachine) { 
        if (['W','w', 'ArrowUp'].includes(event.key)) {       
            moveUp(keyStep, upperPlank);
        } else if (['S','s', 'ArrowDown'].includes(event.key)) {   
            moveDown(keyStep, upperPlank);
        }        
    }

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
