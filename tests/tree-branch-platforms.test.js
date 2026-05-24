const fs = require('fs');
const assert = require('assert');

const platformer = fs.readFileSync('src/PlatformerScene.js', 'utf8');
const boot = fs.readFileSync('src/BootScene.js', 'utf8');

assert.match(boot, /this\.createBranchPlatformTexture\('branch_platform'\)/, 'BootScene should generate a thin branch platform texture');
assert.match(boot, /createBranchPlatformTexture\(key\)/, 'BootScene should define the branch platform texture creator');
assert.match(platformer, /if \(rand\(\) >= 0\.15\) return; \/\/ only 15% of tree1\/tree2 population gets branches/, 'only 15% of tree1/tree2 should receive branch platforms');
assert.match(platformer, /if \(!\['tree1', 'tree2'\]\.includes\(treeKey\)\) return;/, 'branch platforms should only be added to tree1 and tree2');
assert.match(platformer, /const branchCount = 2 \+ Math\.floor\(rand\(\) \* 2\)/, 'selected trees should get 2-3 branch platforms');
assert.match(platformer, /const yOffsets = \[57, 117, 177\]/, 'branches should be stacked in jumpable vertical steps');
assert.match(platformer, /this\.platforms\.create\(branchX, branchY, 'branch_platform'\)/, 'branches should be actual static platforms Mitten can stand on');
assert.match(platformer, /branchYarnSpots\.push\(\{ x: branchX, y: branchY - 7 \}\)/, 'yarn should be placed on top of the branch platforms');
assert.match(platformer, /branchYarnSpots\.forEach\(\(spot, spotIndex\) =>/, 'branch yarn spots should spawn collectible yarn');

console.log('tree branch platform rules OK');
