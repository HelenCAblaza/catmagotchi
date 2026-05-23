const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('src/PlatformerScene.js', 'utf8');

assert.match(
    source,
    /const images = seg\.images \|\| \(seg\.image \? \[seg\.image\] : \[\]\);[\s\S]*images\.forEach\(bg => bg\.destroy\(\)\);/,
    'background cleanup should destroy every sliced background image, not seg.image'
);

assert.doesNotMatch(
    source,
    /seg\.image\.destroy\(\)/,
    'background cleanup must not call seg.image.destroy() because new mobile-safe bg segments store images[]'
);

console.log('adventure background cleanup rules OK');
