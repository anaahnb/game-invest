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
            gravity: { y: 0 },
            debug: false
        }
    },    
    // ID da div no HTML
    parent: 'containerjogo',
    // Necessário pra manipular o DOM / HTML
    dom: {
        createContainer: true
    },
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
var jogador;
var npc;
var paredes;
var balao;
var balaoTexto;
var balaoTextoContainer;
var botaoComecar;
var botaoComecarTexto;

// Relacionado ao carregamento do HTML do questionário
var questionario;

var game = new Phaser.Game(config);

// Carregando recursos que serão utilizados
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

    // Questionário
    this.load.html('questionario', '../questionario/index.html');
}

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

    //  Ativa leitura do teclado
    teclado = this.input.keyboard.createCursorKeys();

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
    balaoComecarTexto = this.add.text(360, 382, 'Começar!', {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '28px', color: '#000' });

    // Listener para chamar função abrirLink ao clicar no botão
    botaoComecar.on('pointerdown', abrirLink, this);
}



function update ()
{
    // Iniciando o jogo, deixar certo objetos invisíveis
    if (iniciaJogo == false)
    {
        balao.setVisible(false);
        balaoTextoContainer.setVisible(false);
        botaoComecar.setVisible(false);
        balaoComecarTexto.setVisible(false);
        iniciaJogo = true;
    }

    // Sequência de movimento/animações do jogador

    if (teclado.left.isDown)
    {
        jogador.setVelocityX(-240);
        jogador.anims.play('esquerda', true);
    }
    else if (teclado.right.isDown)
    {
        jogador.setVelocityX(240);
        jogador.anims.play('direita', true);
    }
    else if (teclado.up.isDown)
    {
        jogador.setVelocityY(-240);
        jogador.anims.play('cima', true);
    }
    else if (teclado.down.isDown)
    {
        jogador.setVelocityY(240);
        jogador.anims.play('baixo', true);
    }
    else
    {
        jogador.setVelocityX(0);
        jogador.setVelocityY(0);

        jogador.anims.stop();
    }
}

// Função para "falar" com o NPC ao tocar nele
function falarNPC (jogador, npc)
{
    // Torna o balão de diálogo visível
    balao.setVisible(true);
    balaoTextoContainer.setVisible(true);
    botaoComecar.setVisible(true);
    balaoComecarTexto.setVisible(true);
    
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