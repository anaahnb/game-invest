// habilitando a visibilidade pelo scrool reveals
window.sr = ScrollReveal({ reset: true})

sr.reveal('.texto-home', { duration: 1000})

sr.reveal('.paragrafo-home', { duration: 1000})

sr.reveal('.container__começar', {
  duration: 1000
})

// sr.reveal('.item-vantagens', {
//   rotate: { x: 0, y: 100, z:0},
//   duration: 2000
// })

sr.reveal('.perfil__', {
  scale: 0.5,
  duration: 2000
})

//Codigo javascript pra navegação
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


