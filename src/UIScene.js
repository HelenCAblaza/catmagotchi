class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true });
    }

    create() {
        // Inventory display
        this.fishText = this.add.text(10, 10, '🐟: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        this.toyText = this.add.text(10, 35, '🧶: 0', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Warning when stats are low
        this.warningText = this.add.text(400, 100, '', {
            fontSize: '24px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    update() {
        const inv = this.registry.get('inventory');
        this.fishText.setText(`🐟: ${inv.fish}`);
        this.toyText.setText(`🧶: ${inv.toys}`);

        const stats = this.registry.get('stats');
        let warning = '';
        if (stats.hunger < 20) warning = '⚠️ Mittens is hungry!';
        else if (stats.energy < 20) warning = '⚠️ Mittens is tired!';
        else if (stats.happiness < 20) warning = '⚠️ Mittens is sad!';
        
        this.warningText.setText(warning);
    }
}
