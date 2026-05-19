     1|class UIScene extends Phaser.Scene {
     2|    constructor() {
     3|        super({ key: 'UIScene', active: true });
     4|    }
     5|
     6|    create() {
     7|        // Inventory display
     8|        this.fishText = this.add.text(10, 10, '🐟: 0', {
     9|            fontSize: '18px',
    10|            color: '#ffffff',
    11|            fontFamily: 'Poppins',
    12|            stroke: '#000000',
    13|            strokeThickness: 3
    14|        });
    15|        
    16|        this.toyText = this.add.text(10, 35, '🧶: 0', {
    17|            fontSize: '18px',
    18|            color: '#ffffff',
    19|            fontFamily: 'Poppins',
    20|            stroke: '#000000',
    21|            strokeThickness: 3
    22|        });
    23|
    24|        // Warning when stats are low
    25|        this.warningText = this.add.text(400, 100, '', {
    26|            fontSize: '24px',
    27|            color: '#ff0000',
    28|            fontFamily: 'Poppins',
    29|            stroke: '#000000',
    30|            strokeThickness: 4
    31|        }).setOrigin(0.5);
    32|    }
    33|
    34|    update() {
    35|        const inv = this.registry.get('inventory');
    36|        this.fishText.setText(`🐟: ${inv.fish}`);
    37|        this.toyText.setText(`🧶: ${inv.toys}`);
    38|
    39|        const stats = this.registry.get('stats');
    40|        let warning = '';
    41|        if (stats.hunger < 20) warning = '⚠️ Mittens is hungry!';
    42|        else if (stats.energy < 20) warning = '⚠️ Mittens is tired!';
    43|        else if (stats.happiness < 20) warning = '⚠️ Mittens is sad!';
    44|        
    45|        this.warningText.setText(warning);
    46|    }
    47|}
    48|