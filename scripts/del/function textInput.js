function onFire () {
    // ...
    let health = 50;
    textInput(health);	
    let meshA = textInput(health);    
    scene.add(meshA);
}

function textInput(textWordsEnter) {
    // ...
    var textMesh = new THREE.Mesh( geometry, textMaterial );
    // scene.add( textMesh )  
    return textMesh;
}


// -----------------------------------------------------------------

function onFire () {
    // ...
    let health = 50;
    textInput(health);	
    // let meshA = textInput(health);    
    // scene.add(meshA);
}

function textInput(textWordsEnter) {
    // ...
    var textMesh = new THREE.Mesh( geometry, textMaterial );
    scene.add( textMesh )  
    // return textMesh;
}

