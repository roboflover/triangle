import * as THREE from './lib/three.module.js';
import {OrbitControls} from './lib/OrbitControls.js'
import { FontLoader } from './lib/FontLoader.js';
import { TextGeometry } from './lib/TextGeometry.js';
import {THREEx} from './lib/threex.domevents.js'
import { GLTFLoader } from './lib/GLTFLoader.js';
import * as BufferGeometryUtils from './lib/BufferGeometryUtils.js';
// import { setupScene } from './render.js';

// 1. объявление настроек сцены камера, количество частиц
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
const controls = new OrbitControls(camera, renderer.domElement);

let tunnelFirst;

// const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let sensivity = 10;
let stats;
let pointEndLoop = 500;
let pointDistance = 10;
let numberOfPoints = 100;
let startPoint = 100;
const tunnelSpeed = 0.8;
const NumberPI = 3.1415926535;
let raycaster2 = new THREE.Raycaster();
let speed;
let mouseCount;
let azimuthSpeed = 0.5;
let lastEnemySpawnTimeStamp;

function addPlane() {
	const geometry = new THREE.PlaneGeometry( 10, 10, 5, 5 );
	const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
	const plane = new THREE.Mesh( geometry, material );
	scene.add( plane );
	return plane;
}

// Спаунер врага
// 1. Функция addEnemy которая состоит из загрузчика 3д модели, материалов и свойств типа здоровья и оружия.
// 2. Постоянный запуск функции addEnemy с определенным временным интервалом пока игра не завершилась.
// 3. Генератор новых координат рандомно в пределах определенных позиций 5х5 квадрата.

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// mouse.x = + (event.targetTouches [0] .pageX / window.innerWidth) * 2 + -1;
	// mouse.y = - (event.targetTouches [0] .pageY / window.innerHeight) * 2 + 1;

	// event.preventDefault();

    // mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    // mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    // raycaster.setFromCamera(mouse, camera);
    // const intersects = raycaster.intersectObjects(yourObject3D);

}

function createTunnel( geometry, particlesCount ) {
	const matrix = new THREE.Matrix4();
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();
	const material = new THREE.MeshBasicMaterial({ 	
		color: 0xffffff, 
		wireframe: true,
		transparent: true,
		opacity: 0.1
	});
	const particles = new THREE.InstancedMesh( geometry, material, particlesCount )
	for ( let i = 0; i < particlesCount; i ++ ) {
		position.z = i * pointDistance;
		rotation.x = -NumberPI / 2;
		rotation.z = NumberPI / 2;
		quaternion.setFromEuler( rotation );
		
		// scale.x = scale.y = scale.z = Math.random() * 0.6;
		scale.x = scale.y = scale.z = 5;
		matrix.compose( position, quaternion, scale );
		particles.setMatrixAt( i, matrix );
	}
	particles.rotateX(NumberPI);
	return particles;
	
}

function loadGeometry() {
	new THREE.BufferGeometryLoader().load ( 'models/geometry4.json',  onGeometryLoaded );
}

function onGeometryLoaded( geometry ) {

	// console.log(geometry);
	geometry.computeVertexNormals();
	// здесь мы создадим инстанс из геометри
	
	tunnelFirst = createTunnel( geometry, numberOfPoints );
	// через условный оператор проверяю положение тунеля
	tunnelFirst.position.z += startPoint;
	scene.add(tunnelFirst);

	// спаун тунеля!
}

function addCube () {
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	const cube = new THREE.Mesh( geometry, material );

	scene.add( cube );
	return cube;
}

const cube = addCube();
const cubeGridSizeMatrix = addCube();
scene.remove(cubeGridSizeMatrix);
let damage = 10;

function addCylinder () {
	let radius = 5;
	const geometryCylinder = new THREE.CylinderGeometry( radius, radius, 5, 32 );
	const materialCylinder = new THREE.MeshBasicMaterial( {color: 0x669944} );
	const cylinder = new THREE.Mesh( geometryCylinder, materialCylinder );
	cylinder.rotation.x = NumberPI / 2;
	cylinder.position.z = -30;
	cylinder.scale.x = cylinder.scale.y = cylinder.scale.z = 0.1;
	cylinder.health = 100;
	scene.add( cylinder );
	return cylinder;
}
const cylinder = addCylinder();

function createBullet () {
	const geometryCylinder = new THREE.CylinderGeometry( 2, 1, 20, 32 );
	const materialCylinder = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	const bullet = new THREE.Mesh( geometryCylinder, materialCylinder );
	bullet.rotation.x = NumberPI / 2;
	bullet.position.z = -1;
	bullet.scale.x = bullet.scale.y = bullet.scale.z = 0.1;
	return bullet;
}

function moveAllBullets () {
	for(let i = 0; i < bullets.length; i++){
		if (bullets[i] === undefined){
			continue
		}
		
		bullets[i].position.z -= 1;
		
		if (bullets[i].position.z < -100){
			
			scene.remove(bullets[i]);
			bullets[i] = undefined;
		}
		// if (bullets[i] пересекается с цилиндром ) { перекрашиваем цилиндр, удаляем баллет } 
	}
}

const bullets = [];
var textMesh;
//textInput(100);
function onFire () {
	console.log("onFire");

	raycaster2.set(cube.position, new THREE.Vector3(0, 0, -1));
	const intersects2 = raycaster2.intersectObjects( scene.children );
	for ( let i = 0; i < intersects2.length; i ++ ) {
		if (intersects2[i].object.health > 0){
		// если у объекта health > 0 тогда делаем код ниже, иначе continue

		// console.log("интерсект", intersects2[i].object);
		intersects2[ i ].object.material.color.set( 0x227700 );
		intersects2[ i ].object.health -= damage;
		let health = intersects2[ i ].object.health;
		textWords = health;		
		console.log(health);
		if (health === 0){
			console.log("убит");
			scene.remove(intersects2[ i ].object);
		}
		console.log(health);
		if (health != health ){ // в этом месте нужно добиться того, чтобы health брался из разных мест
								// возможно обращаться в объектну через intersects2[ i ].object
			scene.remove(textInput(health)); 
		}
		
		textInput(health);	
		// let sss = textInput(health);
		scene.add(textMesh);
		//console.log(sss)		
		}
	}	
	
	const newBullet = createBullet(); 
	newBullet.position.z = 0;
	newBullet.position.x = cube.position.x;
	newBullet.position.y = cube.position.y;
	bullets.push(newBullet);
	scene.add(newBullet);


}

const loader = new FontLoader();
let textWords = String(damage);

function textInput(textWordsEnter) {
	const textWordsEnterString = String(textWordsEnter);
	loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

		const geometry = new TextGeometry( textWordsEnterString, {
			font: font,
			size: 80,
			height: 5,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 10,
			bevelSize: 8,
			bevelOffset: 0,
			bevelSegments: 5
		} );
		var textMaterial = new THREE.MeshPhongMaterial( 
			{ color: 0xff0000, specular: 0xffffff }
		  );
	
		textMesh = new THREE.Mesh( geometry, textMaterial );
		let scaleText = .01;
		textMesh.position.x = -2.5
		textMesh.position.y = 2.5
		textMesh.scale.x = scaleText;
		textMesh.scale.y = scaleText;
		textMesh.scale.z = scaleText;
		
		
		// если новое значение health поменялось то удаляем старое и рисуем новое
		// в этом месте нужно переорганизовать код	
		// я не знаю на каком кадре выполняется эта функция
		// нужно применить промисы
		// прочитать про то как коллбэки превратить в промисы


	} );
	
} 

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener('mousedown', onFire, false);

function generateEnemySpawnPoint() {
	let enemyyStartPointX;
	let enemyyStartPointY;
	const enemySpawnX = [
		-4,
		-2,
		0,
		2,
		4
	];

	const enemySpawnY = [
		-4,
		-2,
		0,
		2,
		4
	];
	
	let matrixRandomIndexX = Math.round(Math.random() * 4);
	let matrixRandomIndexY = Math.round(Math.random() * 4);
	enemyyStartPointX = enemySpawnX[matrixRandomIndexX];
	enemyyStartPointY = enemySpawnY[matrixRandomIndexY];   
	return {enemyyStartPointX, enemyyStartPointY};
}

let enemys = [

];

function addEnemy(){
	const {enemyyStartPointX, enemyyStartPointY } = generateEnemySpawnPoint();
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	const enemy = new THREE.Mesh( geometry, material );

	enemy.position.x = enemyyStartPointX;
	enemy.position.y = enemyyStartPointY;
	enemy.position.z = -60;
	enemy.health = 100;
		
	// console.log(enemy);

	lastEnemySpawnTimeStamp = Date.now();
	// console.log(lastEnemySpawnTimeStamp);
	
	return enemy;
}

// const enemy = addEnemy();

// нужно написать функцию moveAllEnemys() по аналогии с moveAllBullets()
// в функции moveAllEnemys() мы создаем цикл который перебирает всех врагов
// и вызываем moveEnemy() поочередно для каждого врага

function testNextArray () {
	const wayPoints = [
		{point: new THREE.Vector3( 0, 2, 0 )},
		{point: new THREE.Vector3( 1, 5, 1 )},
		{point: new THREE.Vector3( 2, 0, 4 )}
	] 	

	const iterator = array => {
		let index = 0;
	  
		return () => {
		  const value = array[index];
	  
		  if (index < array.length) {
			index++;
		  }; 
		  
		  if (index === array.length) {
			  index = 0;
		  }
	  
		  return value;
		};
	  }
	  
	const next = iterator(wayPoints);
	console.log(next());
	console.log(next());
	console.log(next());
	console.log(next());
	console.log(next());
}
//testNextArray();


function moveEnemy (enemy) {

	const wayPoints = [
		{point: new THREE.Vector3( 0, 2, 0 )},
		{point: new THREE.Vector3( 1, 5, 1 )},
		{point: new THREE.Vector3( 2, 0, 4 )}
	] 
	
	const iterator = array => {
		let index = 0;
	  
		return () => {
		  const value = array[index];
	  
		  if (index < array.length) {
			index++;
		  }; 
		  
		  if (index === array.length) {
			  index = 0;
		  }
	  
		  return value;
		};
	  }
	  const nextPoint = iterator(wayPoints);
	  
	  enemy.position.set(nextPoint().point.x, nextPoint().point.y, nextPoint().point.z);
	  //enemy.position.set(nextPoint().point.x, nextPoint().point.y, nextPoint().point.z);

	// enemy.position.x = nextPoint.point.x;

	// двигаем врага к следующему вейпоинту 
	// после последнего вейпоинта следующий это первый
	// эта функция ничего не возвращает, меняем позицию у самого энеми 
	// http://www.bryanjones.us/article/basic-threejs-game-tutorial-part-3-moving
	
}

function distanceMeter(prevPoint, nextPoint) {
	var posX = prevPoint;
	var diffX = Math.abs(posX - nextPoint);
	var distance = Math.sqrt(diffX * diffX);
	console.log(distance);
	
}


function startEnemy() {
	
	const enemy = addEnemy();
	enemys.push(enemy);
	scene.add(enemy);


}



function setupScene() {
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

function init() {	
	setupScene();
	loadGeometry();
	addPlane();
	startEnemy();
	moveEnemy(enemys[0]);
}

function animate() {

	controls.update();
	requestAnimationFrame(animate);	

	render();

}

function render() {
	

	let deltaTime = Date.now()/1000;


	camera.position.x = mouse.x * 2;
	camera.position.y = mouse.y * 2;
	camera.position.z = 60;
	
	mouseCount = Math.sin( 1 * deltaTime);
	speed = mouseCount;
	// console.log(mouse.x);
	controls.autoRotate = false;
	controls.minAzimuthAngle = -1;
	controls.maxAzimuthAngle =  1;
	controls.autoRotateSpeed = Math.sin( azimuthSpeed * deltaTime)* 2 / 4 * mouseCount;	
	
	// вместо одной переменной буллет нужен массив в который будем класть буллет
	// рендер будет перебирать этот массив по всем элементам и для каждого буллет будет уменьшать позицию.Z

	// если у буллета Z меньше чем -100 мы вызываем scene.remove(bullet) и удаляем его из массива
	// onFire создает новый буллет добавляет его в массив, вызывает scene.add(bullet)  и устанавливает его координаты
	// пересечение с цилиндром путем совпадения координат Z.
	//



	if (tunnelFirst){
		tunnelFirst.position.z += tunnelSpeed;
		if (tunnelFirst.position.z >= pointEndLoop) {
			tunnelFirst.position.z = startPoint;
		}
	}

	renderer.render( scene, camera );
	cube.position.x = mouse.x * sensivity;
	cube.position.y = mouse.y * sensivity;
	let clampCubePos = cube.position;
	// clampCubePos.x = THREE.MathUtils.clamp(Math.round(THREE.MathUtils.clamp(clampCubePos.x,-5,5)) * 2, -4, 4);
	// clampCubePos.y = THREE.MathUtils.clamp(Math.round(THREE.MathUtils.clamp(clampCubePos.y,-5,5)) * 2, -4, 4);
	clampCubePos.x = THREE.MathUtils.clamp(clampCubePos.x,-5,5);
	clampCubePos.y = THREE.MathUtils.clamp(clampCubePos.y,-5,5);
	cylinder.material.color.set( 0x669944 );
	
	moveAllBullets();

	// if если на сцене меньше пяти врагов то выполняем следующее:
	// Date.now получаем текущую метку времени
	// Текущее время минус lastEnemySpawnTimeStamp. узнаем сколько времени прошло между спауном последнего врага и текущего времени
	// if, startEnemy. sесли времени прошло больше 2х секунд то спауним врага
	
	
}

// 3. вызовы функций и создание объектов


init();
animate();