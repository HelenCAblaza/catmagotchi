const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('src/PlatformerScene.js', 'utf8');

assert.match(source, /const fishPerPond = 1 \+ Math\.floor\(rand\(\) \* 3\)/, 'fish should spawn 1-3 near each pond to increase count and tie them to ponds');
assert.match(source, /placedPonds\.forEach\(\(pond, pondIndex\) =>/, 'fish should be placed from pond positions, not random floor positions');
assert.match(source, /const fx = pond\.x \+ \(rand\(\) - 0\.5\) \* 70/, 'fish should stay near/on the pond x range');
assert.match(source, /const toyCount = 5 \+ Math\.floor\(rand\(\) \* 3\)/, 'yarn count should be increased per chunk');
assert.match(source, /this\.fishIcon = this\.add\.image\([^\n]+, 'fish'\)/, 'HUD should use the custom fish sprite as the collected fish icon');
assert.match(source, /this\.toyIcon = this\.add\.image\([^\n]+, 'yarn'\)/, 'HUD should use the custom yarn sprite as the collected yarn icon');
assert.match(source, /Math\.abs\(tx - p\.x\) < 90/, 'yarn placement should reject pond areas');
assert.doesNotMatch(source, /const fishCount = 2 \+ Math\.floor\(rand\(\) \* 3\)/, 'old random-floor fish count should be removed');

console.log('collectible placement rules OK');
