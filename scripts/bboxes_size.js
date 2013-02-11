var moment = require('moment');
var Canvas = require('canvas'),
    fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bboxes.sqlite');

var w = 4000, h = 2000;
var c = new Canvas(w, h);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);
ctx.fillStyle = '#000';
ctx.globalAlpha = 0.01;

var hist = [];

var xscale = (4000 / 360);
var yscale = (2000 / 180);

var j = 0, pass = 0;

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

var xm, ym, xx, yx;

db.each("select (max_lat - min_lat) as latr (max_lon - min_lon) as lonr from osm_changeset;", function(err, row) {
    xm = ~~((row.min_lon + 180) * xscale);
    ym = ~~((90 - row.min_lat) * yscale);
    xx = ~~((row.max_lon + 180) * xscale);
    yx = ~~((90 - row.max_lat) * yscale);
    var size = 
    // ctx.beginPath();
    // Bottom
    ctx.fillRect(xm, ym,
        xx - xm, 1);
    // Top
    ctx.fillRect(xm, yx,
        xx - xm, 1);
    // Left
    ctx.fillRect(xm, ym,
        1, yx - ym);
    // Right
    ctx.fillRect(xx, ym,
        1, yx - ym);
    // ctx.fill();
}, function() {
    // fs.writeFileSync('bboxes_geo_2_' + pad(pass++, 5) + '.png', c.toBuffer());
});
