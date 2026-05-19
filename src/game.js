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
        StartScene,
        HomeScene,
        PlatformerScene
    ]
};

// Wait for Poppins font to load before starting the game
function startGame() {
    window.game = new Phaser.Game(config);
}

if (window._fontsLoaded) {
    startGame();
} else {
    // Poll for font readiness
    const checkFont = setInterval(() => {
        if (window._fontsLoaded) {
            clearInterval(checkFont);
            startGame();
        }
    }, 100);
    // Fallback: start anyway after 3 seconds
    setTimeout(() => {
        if (!window.game) startGame();
    }, 3000);
}
