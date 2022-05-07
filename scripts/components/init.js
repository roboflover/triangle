import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, controls;

export function init() {

    // const width = window.innerWidth;
	// const height = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = -10;
    camera.position.z = 100

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    // controls.dampingFactor = 0.04;

    const selection = document.getElementById( 'selection' );
    window.addEventListener( 'resize', onWindowResize ); 

} init();

function onWindowResize() {
  
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
  
}

export { camera, scene, renderer, controls }

