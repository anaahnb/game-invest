(function() {
  var questions = [
    
    {
    question: "Ao investir, voce gostaria de:",
    choices: ["Preservar o meu patrimônio correndo pouco risco, investir a longo prazo.", 
    "Preservar e valorizar o meu patrimônio correndo alguns riscos e investir em medio e longo prazo.", 
    "Maximizar meu patrimônio em um período curto, se necessario correndo maiores riscos."]
    }, 
  
  {
    question: "Em relaçao ao dinheiro que sera investido, voce:",
    choices: ["Não tem necessidade imediata dele.",
    "Não preciso agora, mas posso precisar em breve.",
    "Vai utilizar como complemento de renda."]
  },

  {
    question: "Sobre seu conhecimento no mercado financeiro:",
    choices: ["Não possuo conhecimento sobre o mercado.",
    "Conheço o básico e já entendo sobre os diferentes tipos de investimentos.",
    "Tenho formação direcionada ao mercado financeiro."]
  },

  {
    question: "Alguma vez, ja investiu?",
    choices: ["Não, nunca investi.",
    "Já investi em renda fixa, como tesouro direto, CDB, poupança e entre outros.",
    "Sim, em renda variável, como ações, cambio, criptomoedas e entre outros."]
  },

  {
    question: "Qual valor voce tem para investir?",
    choices: ["Não possuo muito para investir agora.",
    "Até 10 mil.",
    "Acima de 10 mil."]
  },

  {
    question: "Acompanha as variaçoes do mercado de investimento?",
    choices: ["Não vejo nada sobre.",
    "Somente informações sobre os quais (desejo) aplicar",
    "Acompanho tudo, pois eu tenho interesse em varias modalidades."]
  }

];
  
var questionCounter = 0; // segue numero de questões
var selections = []; // respostas do usuário Array
var quiz = $('#quiz'); // div da quiz
 
// mostra questão inicial
displayNext();

// Click handler para botão "proxima"
$('#next').on('click', function (e) {
  e.preventDefault();
  
  // trava animações indevidas
  if(quiz.is(':animated')) {        
    return false;
  }
  choose();
  
  // protecão caso não ecolha nenhuma questão
  if (isNaN(selections[questionCounter])) {
    alert('Por favor, selecione uma opção!');
  } else {
    questionCounter++;
    displayNext();
  }
});

// Click handler para o botão 'voltar'
$('#prev').on('click', function (e) {
  e.preventDefault();
  
  if(quiz.is(':animated')) {
    return false;
  }
  choose();
  questionCounter--;
  displayNext();
});

// Click handler para o botão 'iniciar'
$('#start').on('click', function (e) {
  e.preventDefault();
  
  if(quiz.is(':animated')) {
    return false;
  }
  questionCounter = 0;
  selections = [];
  displayNext();
  $('#start').hide();
});

// animações de hover
$('.button').on('mouseenter', function () {
  $(this).addClass('active');
});
$('.button').on('mouseleave', function () {
  $(this).removeClass('active');
});

// cria a div que contem a respostas
function createQuestionElement(index) {
  var qElement = $('<div>', {
    id: 'question'
  });
  
  // var header = $('<h2>Question ' + (index + 1) + ' :</h2>');
  // qElement.append(header);
  
  var question = $('<h1>').append(questions[index].question);
  qElement.append(question);
  
  var radioButtons = createRadios(index);
  qElement.append(radioButtons);
  
  return qElement;
}

// cria a lista de respostas com radio buttons
function createRadios(index) {
  var radioList = $('<ul>');
  var item;
  var input = '';
  for (var i = 0; i < questions[index].choices.length; i++) {
    item = $('<li>');
    input = '<input type="radio" name="answer" value=' + i + ' />';
    input += questions[index].choices[i];
    item.append(input);
    radioList.append(item);
  }
  return radioList;
}

// pega o valor da resposta escolhida e coloca na array selections
function choose() {
  selections[questionCounter] = +$('input[name="answer"]:checked').val();
}

// busca e exibe o proximo elemento
function displayNext() {
  quiz.fadeOut(function() {
    $('#question').remove();
    
    if(questionCounter < questions.length){
      var nextQuestion = createQuestionElement(questionCounter);
      quiz.append(nextQuestion).fadeIn();
      if (!(isNaN(selections[questionCounter]))) {
        $('input[value='+selections[questionCounter]+']').prop('checked', true);
      }
      
      // controles para o botão voltar aparecer após a primeira questão
      if(questionCounter === 1){
        $('#prev').show();
      } else if(questionCounter === 0){
        
        $('#prev').hide();
        $('#next').show();
      }
    } else {
      var scoreElem = displayScore();
      quiz.append(scoreElem).fadeIn();
      $('#next').hide();
      $('#prev').hide();
      $('#start').show();
    }
  });
}

// analisa as resposta e retorna o resultado
function displayScore() {
  var score = $('<p>',{id: 'question'});
  var resultado;
  var selection = selections[0] + selections[1] +selections[2] + selections[3] + selections[4] + selections[5];

  if (selection < 3) {
    resultado = 'conservador'
    window.location.replace("../perfil-conservador.html");

  } else if ( selection < 7) {
    resultado = 'moderado';
    score.append('Seu perfil é ' + resultado + ' !');
    return score;

  } else if (selection >= 7) { 
    resultado = 'agressivo';
    score.append('Seu perfil é ' + resultado + ' !');
    return score;
  }

  console.log(selection)
}
})();