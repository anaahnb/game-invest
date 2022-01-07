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

// Usado para identificar o começo do jogo
var iniciaJogo;

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

    // Botões para controlar o personagem
var controleCima;
var controleBaixo;
var controleDir;
var controleEsq;

// Relacionado ao carregamento do HTML do questionário
var questionario;

var game = new Phaser.Game(config);

// Função Nativa do Phaser, carrega em memória recursos (imagens,sons...) que serão utilizados no jogo
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

    // Questionário
    this.load.html('questionario', '../questionario/index.html');
}

// Função Nativa do Phaser, cria objetos, eventos, etc... assim que o jogo é aberto
function create ()
{
    iniciaJogo = false;

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
    balaoTextoContainer = this.add.text(210, 122, balaoTexto, 
        {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '28px', color: '#000', align: 'center' });

    // Botão e seu texto
    botaoComecar = this.add.ellipse(420, 400, 150, 50, 0xffffe0).setInteractive();
    botaoComecar.setStrokeStyle(3, 0xbbbbbb);
    botaoComecarTexto = this.add.text(360, 382, 'Começar!', {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '28px', color: '#000' });

    // Listener para chamar função abrirLink ao clicar no botão
    botaoComecar.on('pointerdown', abrirLink, this);

    // Deixar o diálogo invisível no começo do jogo
    // A função "falarNPC" é responsável por torná-lo visível
    balao.setVisible(false);
    balaoTextoContainer.setVisible(false);
    botaoComecar.setVisible(false);
    botaoComecarTexto.setVisible(false);


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

// Função Nativa do Phaser, funções que são executadas a cada frame (um jogo rodando a 60FPS executaria esta função 60 vezes em um segundo)
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