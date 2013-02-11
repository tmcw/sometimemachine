var Canvas = require('canvas'),
    fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var block = 4;
var w = 360 * block, h = 180 * block;
var c = new Canvas(w, h);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);

function x(lon) {
    return (lon + 180) / 360 * w;
}

function y(lat) {
    return (90 - lat) / 180 * h;
}

var drawn = {};

ctx.fillStyle = '#ff0033';
db.each("SELECT lon, lat FROM osm_changeset GROUP BY round(closed_at / 8640000) LIMIT 1;", function(err, row) {
    console.log(row);
    var xp = Math.floor(x(row.lon));
    var yp = Math.floor(y(row.lat));
    var k = xp + ' ' + yp;
    if (drawn[k]) return;
    ctx.fillRect(
        xp,
        yp,
        block + 1, block + 1);
    drawn[k] = true;
}, function() {
    fs.writeFileSync('changesets_before.png', c.toBuffer());
});
