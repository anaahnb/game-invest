// Função Nativa do Phaser, configurações iniciais
var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 832,
        height: 640
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },    
    // ID da div no HTML
    parent: 'containerjogo',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    "transparent"    : true
};

// Controle de cenas/configurações do jogo
var cenaJogo;

// Variaveis relacionadas aos objetos do jogo
// Personagens e paredes invisiveis
var jogador;
var npc;
var paredes;

// Balao de dialogo do NPC
var balao;
var balaoTexto;
var balaoTextoContainer;
var botaoComecar;
var botaoComecarTexto;
var botaoAindaNao;
var botaoAindaNaoTexto;

// Botões para controlar o personagem
var controleCima;
var controleBaixo;
var controleDir;
var controleEsq;

// Questionário
var questionario = [
    
    {
    pergunta: "Ao investir, voce gostaria de:",
    escolhas: ["Preservar o meu patrimônio correndo pouco risco, investir a longo prazo.", 
    "Preservar e valorizar o meu patrimônio correndo alguns riscos e investir em medio e longo prazo.", 
    "Maximizar meu patrimônio em um período curto, se necessario correndo maiores riscos."]
    }, 
  
  {
    pergunta: "Em relação ao dinheiro que será investido, voce:",
    escolhas: ["Não tem necessidade imediata dele.",
    "Não preciso agora, mas posso precisar em breve.",
    "Vai utilizar como complemento de renda."]
  },

  {
    pergunta: "Sobre seu conhecimento no mercado financeiro:",
    escolhas: ["Não possuo conhecimento sobre o mercado.",
    "Conheço o básico e já entendo sobre os diferentes tipos de investimentos.",
    "Tenho formação direcionada ao mercado financeiro."]
  },

  {
    pergunta: "Alguma vez, ja investiu?",
    escolhas: ["Não, nunca investi.",
    "Já investi em renda fixa, como tesouro direto, CDB, poupança e entre outros.",
    "Sim, em renda variável, como ações, cambio, criptomoedas e entre outros."]
  },

  {
    pergunta: "Qual valor voce tem para investir?",
    escolhas: ["Não possuo muito para investir agora.",
    "Até 10 mil.",
    "Acima de 10 mil."]
  },

  {
    pergunta: "Acompanha as variações do mercado de investimento?",
    escolhas: ["Não vejo nada sobre.",
    "Somente informações sobre os quais (desejo) aplicar",
    "Acompanho tudo, pois eu tenho interesse em varias modalidades."]
  }
];

// Contador de questões
var questionarioCont;

// Repostas do jogador
var questionarioResp;

// Interface do questionário
var questionarioIcone;
var questionarioQuestaoAtual;

var questionarioIntPerg;
var questionarioIntPergTexto;

var questionarioIntResp;
var questionarioIntRespTexto;

var questionarioBotaoA;
var questionarioBotaoB;
var questionarioBotaoC;

// Variável nativa do Phaser
var game = new Phaser.Game(config);


// Função nativa do Phaser, carrega em memória recursos (imagens,sons...) que serão utilizados no jogo
function preload ()
{
    // Fundo e Paredes
    this.load.image('fundo', 'img/CameraDemoMapX4.png');
    this.load.image('parede', 'img/paredes.png');

    // Personagem principal
    this.load.spritesheet('personagem', 
    'img/characterNEWX4.png',
    { frameWidth: 64, frameHeight: 92 }
    );

    // NPC
    this.load.spritesheet('npc', 
        'img/npcX4.png',
        { frameWidth: 64, frameHeight: 120 }
    );

    // Botões
    this.load.image('botoes', 'img/botao.png');
    this.load.image('botaoA', 'img/botaoA.png');
    this.load.image('botaoB', 'img/botaoB.png');
    this.load.image('botaoC', 'img/botaoC.png');

    // Questionário
    this.load.image('questionmark', '../questionario/question.png');
}

// Função nativa do Phaser, cria objetos, eventos, etc... assim que o jogo é aberto
function create ()
{
    // Permite controlar a configuração do jogo pela variável
    cenaJogo = this;

    //Adiciona fundo
    this.add.image(0, 0, 'fundo').setOrigin(0, 0);

    //Adiciona jogador e NPC no mapa
    jogador = this.physics.add.sprite(416, 520, 'personagem');
    npc = this.physics.add.sprite(416, 200, 'npc');

    //Fazer NPC imóvel/não ser afetado por física
    npc.setImmovable(true);
    npc.body.allowGravity = false;

    //Parede invisiveis
    paredes = this.physics.add.staticGroup();
    paredes.create(416, 145, 'parede').setScale(9,1).refreshBody();
    paredes.create(416, 630, 'parede').setScale(9,1).refreshBody();

    //Colisão com as bordas da janela e paredes
    jogador.setCollideWorldBounds(true);
    npc.setCollideWorldBounds(true);
    this.physics.add.collider(jogador, paredes);

    //Colisão entre jogador e NPC
    this.physics.add.collider(jogador, npc, falarNPC, null, this);

    //Adiciona animações ao sprite do jogador
    this.anims.create({
        key: 'baixo',
        frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });        

    this.anims.create({
        key: 'direita',
        frames: this.anims.generateFrameNumbers('personagem', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'cima',
        frames: this.anims.generateFrameNumbers('personagem', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'esquerda',
        frames: this.anims.generateFrameNumbers('personagem', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    // Adiciona balão de dialogo do NPC
    balao = this.add.ellipse(420, 250, 800, 400, 0xeeeeee);
    // Borda do balão
    balao.setStrokeStyle(3, 0xbbbbbb);
    // Efeito visual no balão
    this.tweens.add({
        targets: balao,
        scaleX: 0.95,
        scaleY: 0.95,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    // Texto do balão
    balaoTexto = [
        "Olá, que bom ter você aqui!",
        "Vamos lhe fazer algumas perguntas",
        "para ter uma idéia do seu",
        "perfil de investidor",
        "",
        "Vamos começar?"        
    ];

    // Container para o texto
    balaoTextoContainer = this.add.text(200, 122, balaoTexto, 
        {
            font: '28px Arial',
            color: '#000',
            align: 'center'
        });

    // Botões e seus textos
    botaoComecar = this.add.ellipse(325, 365, 150, 50, 0xffffe0).setInteractive();
    botaoComecar.setStrokeStyle(3, 0xbbbbbb);
    botaoComecarTexto = this.add.text(265, 352, 'Começar!',
    {
        font: 'bold 26px Arial',
        color: '#000'
    });
    
    botaoAindaNao = this.add.ellipse(520, 365, 150, 50, 0xffffe0).setInteractive();
    botaoAindaNao.setStrokeStyle(3, 0xbbbbbb);
    botaoAindaNaoTexto = this.add.text(460, 352, 'Ainda não',
    {
        font: 'bold 26px Arial',
        color: '#000'
    });

    // Listener para chamar função abrirLink ao clicar no botão
    botaoComecar.on('pointerdown', iniciarQuestionario, this);
    botaoAindaNao.on('pointerdown', reiniciar, this);

    // Deixar o diálogo invisível no começo do jogo
    // A função "falarNPC" é responsável por torná-lo visível
    balao.setVisible(false);
    balaoTextoContainer.setVisible(false);
    botaoComecar.setVisible(false);
    botaoComecarTexto.setVisible(false);
    botaoAindaNao.setVisible(false);
    botaoAindaNaoTexto.setVisible(false);


    // Adiciona interface do questionário
    questionarioIntPerg = this.add.rectangle(200, 165, 400, 330, 0xeeeeee);
    // Borda
    questionarioIntPerg.setStrokeStyle(3, 0xbbbbbb);
    // Efeito visual
    this.tweens.add({
        targets: questionarioIntPerg,
        scaleX: 0.98,
        scaleY: 0.95,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    questionarioIntPerg.setVisible(false);

    questionarioIntResp = this.add.rectangle(630, 165, 400, 330, 0xa2ffbb);
    questionarioIntResp.setStrokeStyle(3, 0xbbbbbb);
    this.tweens.add({
        targets: questionarioIntResp,
        scaleX: 0.98,
        scaleY: 0.95,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    questionarioIntResp.setVisible(false);

    questionarioIntPergTexto = this.make.text({
        x: 200,
        y: 165,
        text: '',
        origin: { x: 0.5, y: 0.5 },
        style: {
            align: 'left',
            font: 'bold 28px Arial',
            fill: 'black',
            wordWrap: { width: 380, useAdvancedWrap: true }
        }
    });
    questionarioIntPergTexto.setVisible(false);

    questionarioIntRespTexto = this.make.text({
        x: 633,
        y: 165,
        text: '',
        origin: { x: 0.5, y: 0.5 },
        style: {
            align: 'left',
            font: 'bold 18px Arial',
            fill: 'black',
            wordWrap: { width: 380}
        }
    });
    questionarioIntRespTexto.setVisible(false);

    questionarioIcone = this.add.image(20, 20, 'questionmark').setOrigin(0, 0);
    questionarioIcone.setVisible(false);

    questionarioQuestaoAtual = this.add.text(100, 40, 'Questão ' + (questionarioCont+1) + ' de ' + (questionario.length-1),
    {
        font: 'bold 20px Arial',
        color: '#000'
    });
    questionarioQuestaoAtual.setVisible(false);
    


    questionarioBotaoA = this.physics.add.sprite(100, 320, 'botaoA').setOrigin(0, 0);
    questionarioBotaoA.setImmovable(true);
    questionarioBotaoA.setVisible(false);

    questionarioBotaoB = this.physics.add.sprite(365, 320, 'botaoB').setOrigin(0, 0);
    questionarioBotaoB.setImmovable(true);
    questionarioBotaoB.setVisible(false);

    questionarioBotaoC = this.physics.add.sprite(632, 320, 'botaoC').setOrigin(0, 0);
    questionarioBotaoC.setImmovable(true);
    questionarioBotaoC.setVisible(false);    


    // Controladores
    //  Ativa leitura do teclado
    teclado = this.input.keyboard.createCursorKeys();

    // Listeners para controlar o personagem pelas setas do teclado
    teclado = this.input.keyboard.on('keydown-UP', movimCima, this);
    teclado = this.input.keyboard.on('keydown-DOWN', movimBaixo, this);
    teclado = this.input.keyboard.on('keydown-LEFT', movimEsq, this);
    teclado = this.input.keyboard.on('keydown-RIGHT', movimDir, this);

    teclado = this.input.keyboard.on('keydown-W', movimCima, this);
    teclado = this.input.keyboard.on('keydown-A', movimEsq, this);
    teclado = this.input.keyboard.on('keydown-S', movimBaixo, this);
    teclado = this.input.keyboard.on('keydown-D', movimDir, this);
    
    // Parar o movimento do personagem ao soltar a tecla
    teclado = this.input.keyboard.on('keyup', movimParar, this);    

    // Botões para controlar o personagem por mouse
    controleCima = this.add.image(675, 375, 'botoes').setOrigin(0, 0).setAlpha(0.6);
    controleBaixo = this.add.image(750, 575, 'botoes').setOrigin(0, 0).setAlpha(0.6);
    controleDir = this.add.image(825, 435, 'botoes').setOrigin(0, 0).setAlpha(0.6);
    controleEsq = this.add.image(600, 510, 'botoes').setOrigin(0, 0).setAlpha(0.6);

    controleCima.scale = 0.75;

    controleBaixo.angle = 180;
    controleBaixo.scale = 0.75;

    controleDir.angle = 90;
    controleDir.scale = 0.75;

    controleEsq.angle = -90;
    controleEsq.scale = 0.75;

    // Adicionado listeners para quando pressionar os botões na tela
    controleCima.setInteractive();
    controleCima.on('pointerdown', movimCima, this);

    controleBaixo.setInteractive();
    controleBaixo.on('pointerdown', movimBaixo, this);

    controleDir.setInteractive();
    controleDir.on('pointerdown', movimDir, this);

    controleEsq.setInteractive();
    controleEsq.on('pointerdown', movimEsq, this);

    // Listeners ao soltar o botão
    controleCima.on('pointerup', movimParar, this);
    controleBaixo.on('pointerup', movimParar, this);
    controleDir.on('pointerup', movimParar, this);
    controleEsq.on('pointerup', movimParar, this);    
}

// Função nativa do Phaser, para executar comandos a cada frame (um jogo rodando a 60FPS executaria esta função 60 vezes em um segundo)
function update ()
{
}

// Funcões
// Funções para movimentar o jogador
function movimCima ()
{
    jogador.setVelocityY(-240);
    jogador.anims.play('cima', true);  
}

function movimBaixo ()
{
    jogador.setVelocityY(240);
    jogador.anims.play('baixo', true);
}

function movimDir ()
{
    jogador.setVelocityX(240);
    jogador.anims.play('direita', true);
}

function movimEsq ()
{
    jogador.setVelocityX(-240);
    jogador.anims.play('esquerda', true);  
}

function movimParar ()
{
    jogador.setVelocityX(0);
    jogador.setVelocityY(0);
    jogador.anims.stop();
}

// Função para "falar" com o NPC ao tocar nele
function falarNPC (jogador, npc)
{
    // Torna o balão de diálogo visível
    balao.setVisible(true);
    balaoTextoContainer.setVisible(true);
    botaoComecar.setVisible(true);
    botaoComecarTexto.setVisible(true);
    botaoAindaNao.setVisible(true);
    botaoAindaNaoTexto.setVisible(true);
    
}

// Iniciando o questionário
function iniciarQuestionario ()
{
    balao.setVisible(false);
    balaoTextoContainer.setVisible(false);
    botaoComecar.setVisible(false);
    botaoComecarTexto.setVisible(false);
    botaoAindaNao.setVisible(false);
    botaoAindaNaoTexto.setVisible(false);

    questionarioCont = 0;
    questionarioResp = [];

    questionarioIntPerg.setVisible(true);
    questionarioIntPergTexto.setVisible(true);

    questionarioIntResp.setVisible(true);
    questionarioIntRespTexto.setVisible(true);

    questionarioIcone.setVisible(true);

    questionarioQuestaoAtual.setVisible(true);

    questionarioBotaoA.setVisible(true);
    questionarioBotaoB.setVisible(true);
    questionarioBotaoC.setVisible(true);

    // Adiciona Colisão entre Jogador e Botoes
    this.physics.add.collider(jogador, questionarioBotaoA, questionarioEscolhaA, null, this);
    this.physics.add.collider(jogador, questionarioBotaoB, questionarioEscolhaB, null, this);
    this.physics.add.collider(jogador, questionarioBotaoC, questionarioEscolhaC, null, this);

    // Parede invisível para impedir o jogador de passar debaixo da interface de perguntas
    paredes.create(416, 280, 'parede').setScale(9,1).refreshBody();

    questionarioProxPerg();
}

// Busca a próxima pergunta do questionário
function questionarioProxPerg ()
{
    questionarioQuestaoAtual.setText('Questão ' + (questionarioCont+1) + ' de ' + (questionario.length));
    jogador.x = 416;
    jogador.y = 520;
    movimParar();

    if(questionarioCont < questionario.length){
        questionarioIntPergTexto.setText(questionario[questionarioCont].pergunta);

        questionarioIntRespTexto.setText([
            "A. " + questionario[questionarioCont].escolhas[0],
            "",
            "B. " + questionario[questionarioCont].escolhas[1],
            "",
            "C. " + questionario[questionarioCont].escolhas[2],
        ]);        
    }
    else if (questionarioCont < 7){
        questionarioIcone.setVisible(false);
        questionarioQuestaoAtual.setVisible(false);

        questionarioIntPergTexto.setText('Obrigado por participar! Está preparado para saber seu perfil de investidor?');

        questionarioIntRespTexto.setText('Toque em qualquer botão para continuar');

        questionarioCont++;
        console.log(questionarioCont);
    }
    else if (questionarioCont < 9){
        abrirLinkPerfil();
        questionarioIntPergTexto.setText('Quer fazer o teste novamente?');
        questionarioCont++;
    }
    else {
        reiniciar();        
    }
}

function questionarioEscolhaA (){
    questionarioResp[questionarioCont] = 0;
    questionarioCont++;
    questionarioProxPerg();
}

function questionarioEscolhaB (){
    questionarioResp[questionarioCont] = 1;
    questionarioCont++;
    questionarioProxPerg();
}

function questionarioEscolhaC (){
    questionarioResp[questionarioCont] = 2;
    questionarioCont++;
    questionarioProxPerg();
}

// Função de abrir link para o questionário
function abrirLink ()
{
    var url = '../questionario/index.html';

    var s = window.open(url, '_blank');

    if (s && s.focus)
    {
        s.focus();
    }
    else if (!s)
    {
        window.location.href = url;
    }
}

function abrirLinkPerfil ()
{

    var somaResp = questionarioResp[0] + questionarioResp[1] +questionarioResp[2] + questionarioResp[3] + questionarioResp[4] + questionarioResp[5];
    var url;

    if (somaResp < 3)
    {
        url = '../perfil-conservador.html';
    } else if (somaResp < 7)
    {
        url = '../perfil-moderado.html';
    } else if (somaResp >= 7)
    {
        url = '../perfil-moderado.html';
        //TROCAR ISSO DEPOIS
    }

    var s = window.open(url, '_blank');

    if (s && s.focus)
    {
        s.focus();
    }
    else if (!s)
    {
        window.location.href = url;
    }
}

// Reseta o jogo
function reiniciar (){
    cenaJogo.scene.restart();
}