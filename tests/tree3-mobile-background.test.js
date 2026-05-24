const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('src/PlatformerScene.js', 'utf8');
const boot = fs.readFileSync('src/BootScene.js', 'utf8');

assert.match(source, /const treeY = key === 'tree3' \? 558 : \(key === 'tree2' \? 559 : 562\)/, 'tree3 should sit a tiny bit higher than before while tree1/tree2 stay unchanged');
assert.match(source, /this\.bgTileWidth = 1920/, 'adventure background should stay sliced into mobile-safe 1920px tiles');
assert.match(source, /this\.bgTileKeys = \['adventure_bg_0', 'adventure_bg_1', 'adventure_bg_2'\]/, 'adventure should use all three sliced background tiles');
for (const key of ['adventure_bg_0', 'adventure_bg_1', 'adventure_bg_2']) {
    assert.match(boot, new RegExp(`this\\.load\\.image\\('${key}', 'assets/adventure-bg-[0-2]\\.png\\?v=1'\\)`), `${key} should be loaded from a mobile-safe sliced image`);
}

console.log('tree3 and mobile background rules OK');
