window.onload = function(){
	//Constantes que armazenam o código de cada seta do teclado
	var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	var cnv = document.querySelector("canvas");
	var	ctx = cnv.getContext("2d");
	
	var spriteSheet = new Image();
	spriteSheet.src = "img/character.png";
	var hero = new Sprite(spriteSheet);
	
	var scene = new Image();
	scene.src = "img/CameraDemoMap.png";
	
	window.addEventListener("keydown",keydownHandler,false);
	window.addEventListener("keyup",keyupHandler,false);
	
	function keydownHandler(e){
		switch(e.keyCode){
			case RIGHT:
				hero.mvRight = true;
				hero.mvLeft = false;
				hero.mvUp = false;
				hero.mvDown = false;
				break;
			case LEFT:
				hero.mvRight = false;
				hero.mvLeft = true;
				hero.mvUp = false;
				hero.mvDown = false;
				break;
			case UP:
				hero.mvRight = false;
				hero.mvLeft = false;
				hero.mvUp = true;
				hero.mvDown = false;
				break;
			case DOWN:
				hero.mvRight = false;
				hero.mvLeft = false;
				hero.mvUp = false;
				hero.mvDown = true;
				break;
		}
	}
	
	function keyupHandler(e){
		switch(e.keyCode){
			case RIGHT:
				hero.mvRight = false;
				break;
			case LEFT:
				hero.mvLeft = false;
				break;
			case UP:
				hero.mvUp = false;
				break;
			case DOWN:
				hero.mvDown = false;
				break;
		}
	}
	
	//Quano a imagem é carregada, o programa é iniciado
	spriteSheet.onload = function(){
		init();
		hero.posX = hero.posY = 150;
	}

	function init(){
		loop();
	}

	function update(){
		hero.move();
	}

	function draw(){
		ctx.clearRect(0,0,cnv.width,cnv.height);
		ctx.drawImage(scene,0,0,scene.width,scene.height,0,0,scene.width,scene.height);
		hero.draw(ctx);
	}

	function loop(){
		window,requestAnimationFrame(loop,cnv);
		update();
		draw();
	}
}
