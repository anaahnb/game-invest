// Codigo javascript pra navegação
const button = document.getElementById('saber')

button.addEventListener('click', () =>{
    
    location.href = "saiba-mais.html"
}) 

function navbar (){
    const MenuBurguer = document.getElementById('nav-bar')
        if(MenuBurguer.style.display === 'block'){
          MenuBurguer.style.display = "none"
        } else{
          MenuBurguer.style.display = "block"
        }
  
  }

// Animar ao scroll

