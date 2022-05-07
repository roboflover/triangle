import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';
import { init } from './init.js';
import {  camera, scene, renderer, controls } from './init.js';

// let camera, scene, renderer, controls;

let sampler;
let scatterMesh, scatterGeo, scatterMat;
let positionArray = [];
let _newPosition = new THREE.Vector3();

const api = {

  count: 5000,
  distribution: 'random',
  //resample: resample,
  surfaceColor: 0xFFF784,
  surfaceSize: 200,
  backgroundColor: 0xE39469,
  size: 1,
  factor: 1.2

};

const count = api.count;
const ages = new Float32Array( count );
const scales = new Float32Array( count );
const dummy = new THREE.Object3D();
const size = api.size;
const _position = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _scale = new THREE.Vector3();
const surfaceGeometry = new THREE.SphereGeometry( api.surfaceSize, 50, 50 ).toNonIndexed();
const surfaceMaterial = new THREE.MeshBasicMaterial( {color: api.backgroundColor, wireframe: true, side: THREE.DoubleSide } ); 
const surface = new THREE.Mesh( surfaceGeometry, surfaceMaterial );
// Source: https://gist.github.com/gre/1650294
const easeOutCubic = function ( t ) {

  return ( -- t ) * t * t + 1;

};
// Scaling curve causes particles to grow quickly, ease gradually into full scale, then
// disappear quickly. More of the particle's lifetime is spent around full scale.
const scaleCurve = function ( t ) {

  return Math.abs( easeOutCubic( ( t > 0.5 ? 1 - t : t ) * 2 ) );

};

function backgroundAsteroid (){

  createMesh();
  resample();

  function resample() {

    const vertexCount = surface.geometry.getAttribute( 'position' ).count;
    
    console.info( 'Sampling ' + count + ' points from a surface with ' + vertexCount + ' vertices...' );
    console.time( '.build()' );
  
    sampler = new MeshSurfaceSampler( surface )
      .setWeightAttribute( api.distribution === 'weighted' ? 'uv' : null )
      .build();
    
    console.timeEnd( '.build()' );
    console.time( '.sample()' );
  
    for ( let i = 0; i < count; i ++ ) {
  
      ages[ i ] = i * .001 // Math.random();
      scales[ i ] = scaleCurve( ages[ i ] ) + 5 * .7;
      //console.log('scales[ i ]', scales[ i ]);
      resampleParticle( i );
  
    }
  
    for ( let k = 0; k < count; k ++ ) {
  
    }
    console.timeEnd( '.sample()' );
    scatterMesh.instanceMatrix.needsUpdate = true;

    function resampleParticle( i ) { 
  
      sampler.sample( _position, _normal );
      let allowDistance;
      allowDistance = true;
      _normal.add( _position );
      dummy.scale.set( scales[ i ], scales[ i ], scales[ i ] );
      dummy.position.copy( _position );
      dummy.lookAt( _normal );
      dummy.updateMatrix();  
      _newPosition.copy( dummy.position );
      positionArray.push( new THREE.Vector3(_newPosition.x, _newPosition.y, _newPosition.z ));
      // вернуться назад и удалить соприкасающийся куб  
      for( let j = 0; j < count; j++) {
        // дистанция
        if ( positionArray[j] !== undefined) {
          const pointA = positionArray[ i ];
          const pointB = positionArray[ j ];
          const distance = pointA.distanceTo(pointB);
          const sizeFactor = size; // *api.factor;
          const originalDistance = distance - (0.5*(scales[i] + scales[j]));
          
          if ( originalDistance < sizeFactor && distance > 0.01 ){
            
            allowDistance = false;             
            }     
        }   
      }
      if (allowDistance){
        scatterMesh.setMatrixAt( i, dummy.matrix );
        
      }
    }
  }

    function createMesh() {

    const _scatterGeo = new THREE.BoxGeometry( size, size, size );
    const _scatterMat = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true } ); 
    const _scatterMesh = new THREE.Mesh( _scatterGeo, _scatterMat );
    scatterGeo = _scatterGeo.clone();
    scatterMat = _scatterMesh.material;
    
    scatterMesh = new THREE.InstancedMesh(scatterGeo, scatterMat, count);
    scatterMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
    scene.add(scatterMesh);
    
  }
  
} 
backgroundAsteroid()

animate(0);

function animate(dt) {

  requestAnimationFrame( animate ); 
  
  dt = dt * 0.001;
  scatterMesh.rotation.x = Math.sin(dt)*.1;
  scatterMesh.rotation.z = Math.cos(dt * .5)*.1;

  renderer.render( scene, camera );
  controls.update();

}

export { scatterMesh };