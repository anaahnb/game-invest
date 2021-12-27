function Sprite(img){
	this.mvLeft = this.mvUp = this.mvRight = this.mvDown = false;
	this.srcX = this.srcY = 0; 	// origem para captura da imagem a ser exibida

	// posição no canvas onde a figura será exibida
	this.posX = this.posY = 0;
	this.width = 16;
	this.height = 30;
	this.speed = 1;
	this.img = img;
	this.countAnim = 0;

	// desenha a figura
	this.draw = function(ctx){
		ctx.drawImage(	this.img,	// imagem de origem
						
						// captura da imagem
						this.srcX,	// origem da captura no eixo X
						this.srcY,	// origem da captura no eixo Y
						this.width,	// largura da imagem que será capturada
						this.height, // altura da imagem que será capturada
						
						//exibição da imagem
						this.posX,	// posição no eixo X onde a imagem será exibida 
						this.posY,	// posição no eixo Y onde a imagem será exibida 
						this.width,	// largura da imagem a ser exibida 
						this.height	// altura da imagem a ser exibida 
					);
		this.animation();
	}

	// move a figura
	this.move = function(){
		if(this.mvRight){
			this.posX += this.speed;
			this.srcY = this.height * 1; 
		} else
		if(this.mvLeft){
			this.posX -= this.speed;
			this.srcY = this.height * 3; 
		} else
		if(this.mvUp){
			this.posY -= this.speed;
			this.srcY = this.height * 2; 
		} else
		if(this.mvDown){
			this.posY += this.speed;
			this.srcY = this.height * 0; 
		}
	}
	
	// anima a figura
	this.animation = function(){
		if(this.mvLeft || this.mvUp || this.mvRight || this.mvDown){
			// caso qualquer seta seja pressionada, o contador de animação é incrementado
			this.countAnim++;
			if(this.countAnim >= 16){
				this.countAnim = 0;
			}
			this.srcX = Math.floor(this.countAnim / 5) * this.width;
		} else {
			// caso nenhuma tecla seja pressionada, o contador de animação é zerado e a imagem do personagem parado é exibida
			this.srcX = 0;
			this.countAnim = 0;
		}
	}
}

