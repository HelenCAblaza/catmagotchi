const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 800,
    parent: 'game-container',
    backgroundColor: '#2a2a3e',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
        BootScene,
        HomeScene,
        PlatformerScene
    ]
};

window.game = new Phaser.Game(config);
