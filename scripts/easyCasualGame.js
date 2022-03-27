import * as THREE from './lib/three.module.js';

let camera, scene, renderer;
let meshEnemy;
let meshPlayer;

init();
animate(0);

function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 200;

	scene = new THREE.Scene();

	const geometryEnemy = new THREE.BoxGeometry( 10, 10, 10 );
	const materialEnemy = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

	meshEnemy = new THREE.Mesh( geometryEnemy, materialEnemy );
	meshEnemy.position.x = 50;
	scene.add( meshEnemy );

	const geometryPlayer = new THREE.BoxGeometry( 10, 10, 10 );
	const materialPlayer = new THREE.MeshBasicMaterial( { color: 0x00ccff } );

	meshPlayer = new THREE.Mesh( geometryPlayer, materialPlayer );
	scene.add( meshPlayer );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
let timeElapsed = 0;
function animate(dt) {

	// ДЗ - сделать так, чтобы красный кубик двигался справа-налево
	// когда красный кубик уехал за левую границу его нужно удалять и создавать новый красный кубик который будет двигатьс также.

	requestAnimationFrame( animate );
	console.log(dt);
	
	// научиться пользоваться счетчиком через animate
	// можно привязать скорость к dt тогда кубики будут двигаться всё быстрее и быстрее

	meshEnemy.rotation.x += 0.005;
	meshEnemy.rotation.y += 0.01;

	meshPlayer.rotation.x += 0.005;
	meshPlayer.rotation.y += 0.01;

	renderer.render( scene, camera );

}