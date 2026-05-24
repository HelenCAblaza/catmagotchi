const fs = require('fs');
const assert = require('assert');

const platformer = fs.readFileSync('src/PlatformerScene.js', 'utf8');
const boot = fs.readFileSync('src/BootScene.js', 'utf8');

for (const key of ['butterfly', 'rabbit', 'frog', 'recovery_heart']) {
    assert.match(boot, new RegExp(`create[A-Za-z]+Texture\\('${key}'\\)`), `BootScene should generate ${key} texture`);
}

assert.match(platformer, /this\.recoveryItems = this\.physics\.add\.group\(\)/, 'adventure scene should have a recovery item physics group');
assert.match(platformer, /this\.physics\.add\.overlap\(this\.player, this\.recoveryItems, \(p, item\) => this\.collectRecovery\(p, item\)\)/, 'Mitten should be able to collect cute recovery hearts');
assert.match(platformer, /const objects = \{ ground: \[\], decors: \[\], fish: \[\], toys: \[\], jumpFish: \[\], timers: \[\], ambient: \[\], recovery: \[\] \}/, 'chunk data should track ambient critters and recovery items for cleanup');
assert.match(platformer, /this\.spawnAmbientCritters\(startX, placedPonds, objects, rand\)/, 'chunks should occasionally spawn ambient critters and recovery');
assert.match(platformer, /spawnAmbientCritters\(startX, placedPonds, objects, rand\)/, 'PlatformerScene should define ambient critter spawning');
assert.match(platformer, /rand\(\) < 0\.6[\s\S]*'butterfly'/, 'butterflies should show up sometimes');
assert.match(platformer, /rand\(\) < 0\.18[\s\S]*'rabbit'/, 'rabbits should show up sometimes but remain rare');
assert.match(platformer, /rand\(\) < 0\.22[\s\S]*'frog'/, 'frogs should show up sometimes near ponds');
assert.match(platformer, /rand\(\) < 0\.28[\s\S]*'recovery_heart'/, 'cute recovery hearts should show up sometimes');
assert.match(platformer, /collectRecovery\(player, item\)/, 'PlatformerScene should define recovery collection behavior');
assert.match(platformer, /stats\.energy = Math\.min\(100, stats\.energy \+ 18\)/, 'recovery should restore energy');
assert.match(platformer, /objects\.ambient\.forEach\(a => a\.destroy\(\)\)/, 'ambient critters should be destroyed with chunk cleanup');
assert.match(platformer, /objects\.recovery\.forEach\(item => item\.destroy\(\)\)/, 'recovery items should be destroyed with chunk cleanup');

console.log('ambient critters and recovery rules OK');
