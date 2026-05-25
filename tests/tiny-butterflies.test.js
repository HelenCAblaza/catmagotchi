const fs = require('fs');
const assert = require('assert');

const bootSource = fs.readFileSync('src/BootScene.js', 'utf8');
const platformerSource = fs.readFileSync('src/PlatformerScene.js', 'utf8');

assert.match(bootSource, /createButterflyTexture\('butterfly_pink'/, 'BootScene should generate a pastel pink butterfly texture');
assert.match(bootSource, /createButterflyTexture\('butterfly_blue'/, 'BootScene should generate a pastel blue butterfly texture');
assert.match(bootSource, /createButterflyTexture\('butterfly_yellow'/, 'BootScene should generate a pastel yellow butterfly texture');
assert.match(bootSource, /createButterflyTexture\(key, wingColor, lowerWingColor\)/, 'BootScene should define reusable tiny butterfly texture drawing');
assert.match(platformerSource, /spawnButterflyCluster\(fx, fy - 24, objects, rand\)/, 'flower placement should spawn butterfly clusters above flowers');
assert.match(platformerSource, /if \(i % 4 === 1\)/, 'butterflies should only appear around about 25% of foreground flower clusters');
assert.match(platformerSource, /const count = 1 \+ Math\.floor\(rand\(\) \* 2\)/, 'each flower cluster should get only 1-2 butterflies');
assert.match(platformerSource, /this\.tweens\.killTweensOf\(d\)/, 'chunk cleanup should stop butterfly tweens before destroying decor');

console.log('tiny butterfly ambience rules OK');
