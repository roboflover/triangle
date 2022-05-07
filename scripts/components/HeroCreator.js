import * as THREE from 'three';

export class HeroCreator {

    constructor(dataObj) {
        this._typeOfHero = dataObj;
    }

    _createPlayer = () => {
        const geometry = new THREE.BoxGeometry( 10, 10, 10 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ccff } );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = -20;
        mesh.name = 'player';
        return mesh;
    }

    _createEnemy = () => {
        const geometry = new THREE.BoxGeometry( 5, 5, 5 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );		
        const mesh = new THREE.Mesh( geometry, material );
        mesh.name = 'enemy';
        mesh.health = 10;
        return mesh;
    }

    _createBonus = () => {
        const geometry = new THREE.BoxGeometry( 10, 10, 10 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );		
        const mesh = new THREE.Mesh( geometry, material );
        mesh.name = 'bonus';
        mesh.health = 10;
        return mesh;
    }

    _createMason = () => {
        const geometry = new THREE.BoxGeometry( 5, 5, 5 );
        const material = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(20, 255, 50)") } );		
        const mesh = new THREE.Mesh( geometry, material );
        mesh.name = 'mason';
        mesh.health = 10;
        return mesh;
    }

    renderHero (type) {
        let mesh;
        switch(type) {
            case 'player':  
            mesh = this._createPlayer();
            return mesh

            case 'enemy':
            mesh = this._createEnemy();
            return mesh

            case 'bonus': 
            mesh = this._createBonus();
            return mesh

            case 'mason': 
            mesh = this._createMason();
            return mesh 

            default: 
            console.log('error');
        }
    }
} 