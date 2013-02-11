var Canvas = require('canvas'),
    fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var w = 20000, h = 20000;
var c = new Canvas(w, h);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);

var lives = [];

db.each("select min(closed_at), max(closed_at) from osm_changeset GROUP BY user_id;", function(err, row) {
    if (Math.round(row['max(closed_at)'] - row['min(closed_at)'] / 1000) > 0) {
        lives.push(Math.round((row['max(closed_at)'] - row['min(closed_at)']) / 1000));
    }
}, function() {
    fs.writeFileSync('lives_compact.json', JSON.stringify(lives));
});
