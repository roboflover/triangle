import * as THREE from './lib/three.module.js';
import {OrbitControls} from './lib/OrbitControls.js'
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );
export const renderer = new THREE.WebGLRenderer();
export const light = new THREE.AmbientLight( 0x404040 ); // soft white light
export const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
export const controls = new OrbitControls(camera, renderer.domElement);

export function setupScene() {

	//camera
	camera.position.z = 60;
	camera.position.x = 0;
	camera.position.y = 0

	//controls
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.09;
	controls.screenSpacePanning = false;
	controls.minDistance = 30;
	controls.maxDistance = 150;
	controls.maxPolarAngle =  Math.PI / 2;
	controls.minPolarAngle =  Math.PI / 2;	
	controls.staticMoving  = false;
	controls.autoRotate = false;
	controls.screenSpacePanning = true; 
	controls.enabled = false;

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.outputEncoding = THREE.sRGBEncoding;
	
	//renderer
	renderer.setSize( window.innerWidth, window.innerHeight );
	// scene
	scene.background = new THREE.Color( 0x000 );
	//light
	directionalLight.position.x = 0;
	directionalLight.position.y = 50;
	directionalLight.position.z = 50;
	scene.add( light );
	scene.add( directionalLight );
	document.getElementById( 'container' ).appendChild( renderer.domElement );
}

// export {setupScene}; 