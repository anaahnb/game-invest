class Overworld {
    constructor(config) {
      this.element = config.element;
      this.canvas = this.element.querySelector(".game-canvas");
      this.ctx = this.canvas.getContext("2d");
    }
   
    init() { // adicionando cenario
      const image = new Image();
      image.onload = () => {
        this.ctx.drawImage(image,0,0)
      };
   
      image.src = "./assets/img/rpg/CameraDemoMap.png";
   
      const x = 5;
      const y = 6;
   
      const hero = new Image();
      hero.onload = () => { // adicionando personagem
        this.ctx.drawImage(hero, 0, 0,
          16, // width do corte 
          32, // height do corte
          x * 13, // posicao no cenario
          y * 7,
          16,
          32
        )
      }
      hero.src = "./assets/img/rpg/character.png";
   
    }
   }