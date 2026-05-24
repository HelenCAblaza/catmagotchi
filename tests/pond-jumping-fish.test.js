const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('src/PlatformerScene.js', 'utf8');

assert.match(source, /jumpFish: \[\], timers: \[\]/, 'chunk data should track jumping fish sprites and timers for cleanup');
assert.match(source, /schedulePondJumpFish\(pond\.x, pondType, objects, rand\)/, 'each pond should schedule occasional jumping fish');
assert.match(source, /schedulePondJumpFish\(pondX, pondType, objects, rand\)/, 'PlatformerScene should define a pond jumping fish scheduler');
assert.match(source, /this\.time\.addEvent\(\{[\s\S]*delay: 2600 \+ rand\(\) \* 4200[\s\S]*loop: true/, 'jumping fish should happen occasionally with a varied repeating timer');
assert.match(source, /this\.tweens\.add\(\{[\s\S]*targets: fish[\s\S]*y: pondY - 62[\s\S]*yoyo: true/, 'jumping fish should arc upward out of the pond then return');
assert.match(source, /objects\.jumpFish\.forEach\(f => f\.destroy\(\)\)/, 'jumping fish sprites should be destroyed with the chunk');
assert.match(source, /objects\.timers\.forEach\(timer => timer\.remove\(false\)\)/, 'pond fish timers should be removed with the chunk');

console.log('pond jumping fish rules OK');
