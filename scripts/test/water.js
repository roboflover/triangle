let water = null;
let height;



init();
function init(){
move();  
animate();   
}



function move(){
				setupEventtest();
		function setupEventtest(){
			window.addEventListener( 'keydown', handleKeyDown1, false);
			window.addEventListener( 'keyup', handleKeyUp1, false);
		}
						
		function handleKeyDown1(event){
			let keyCode = event.keyCode;
			switch(keyCode){    
				case 49: // 1	 включит и далее льет холодную
        water = 1;
					break;  
         case 50: // 2  включит и далее льет теплую
        water = 2;
					break;
        case 51: // 3  однократная функция, что -то сделать и завершить        
        if (water == 4) return null;  // если уже был выключен, если прошел цикл, то больше не будет брызгаться и еще раз перевыключаться
        water = 3;
					break;  
			}
		}

		function handleKeyUp1(event){
			let keyCode = event.keyCode;
			switch(keyCode){               
				case 49: // 1                    
					break;  
        case 50: // 2								         
					break;
        case 51: // 3
					break;    
			}
		}
}


  function goWater(){
  if (water == 1) console.log ( " hot ");
  else if (water == 2) console.log ( " cold ");
  else if (water == 3) doid (),
  water = 4;
  else if (water == 4) return null;  
  }

  function doid (){
  	for(let i=0; i < 5; i++){
 		height = i;
 		console.log ( i + " брызги и выкл воду вообще");
  	}
  }




	function animate() { 
 
			requestAnimationFrame( animate );
			requestAnimationFrame( goWater );					
		}			

