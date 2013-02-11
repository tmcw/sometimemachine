var moment = require('moment');
var Canvas = require('canvas'),
    fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bboxes.sqlite');

var w = 2000, h = 1500;
var c = new Canvas(w, h);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);
ctx.fillStyle = 'rgba(0, 0, 0, 0.005)';

var hist = [];

var day = moment("01-01-2004", "MM-DD-YYYY");
var last = moment("01-02-2004", "MM-DD-YYYY");
var end = moment("01-01-2013", "MM-DD-YYYY");

var xscale = (2000 / 360);
var yscale = (1500 / 180);

var j = 0;
db.each("select (max_lat - min_lat) as y, (max_lon - min_lon) as x from osm_changeset;", function(err, row) {
    var x = ~~(row.x * xscale);
    var y = ~~(row.y * yscale);
    ctx.beginPath();
    // Bottom
    ctx.rect(0, 0,
        x, 1);
    // Left
    ctx.rect(0, 0,
        1, y);
    // Right
    ctx.rect(x - 1, 0,
        1, y);
    // Top
    ctx.rect(0, y - 1,
        x, 1);
    ctx.fill();
}, function() {
    fs.writeFileSync('bboxes_size/0.png', c.toBuffer());
});
