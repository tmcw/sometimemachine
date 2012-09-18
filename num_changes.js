var Canvas = require('canvas'),
    fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var w = 20000, h = 20000;
var c = new Canvas(w, h);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);

var hist = [];

db.each("select sum(num_changes) as n from osm_changeset GROUP BY user_id;", function(err, row) {
    hist.push(row.n);
}, function() {
    fs.writeFileSync('num_changes.json', JSON.stringify(hist));
});
