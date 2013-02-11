var moment = require('moment');
var Canvas = require('canvas'),
    fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Volumes/A/sometimemachine/bboxes.sqlite');

var w = 1536, h = 768;
var c = new Canvas(w, h);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);
ctx.fillStyle = '#000';
ctx.globalAlpha = 0.09;
// ctx.globalAlpha = 1;

var hist = [];

var day = moment("01-01-2004", "MM-DD-YYYY");
var last = moment("01-02-2004", "MM-DD-YYYY");
var end = moment("01-01-2013", "MM-DD-YYYY");

var xscale = w / 360;
var yscale = h / 180;

var j = 0, pass = 0;

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

var istom = false;

db.each("select user_id, max_lat, min_lat, max_lon, min_lon from osm_changeset where user_id = 207745;", function(err, row) {
    var xm = ~~((row.min_lon + 180) * xscale);
    var ym = ~~((90 - row.min_lat) * yscale);
    var xx = ~~((row.max_lon + 180) * xscale);
    var yx = ~~((90 - row.max_lat) * yscale);
    /*
    if (row.user_id === 957) {
        if (!istom) {
            istom = true;
            ctx.fillStyle = '#FF00AE';
        }
    } else if(istom) {
        ctx.fillStyle = '#000';
    }
    */
    // ctx.beginPath();
    // Bottom
    if (row.user_id === 207745) {
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
    }
    // ctx.fill();
    // if (j++ % 10000 === 0) {
    //     console.log('printing ', pass);
    //     fs.writeFileSync('bboxes_output/bboxes_geo_tmcw_' + pad(pass++, 5) + '.png', c.toBuffer());
    // }
}, function() {
    fs.writeFileSync('bboxes_output/bboxes_geo_ne2.png', c.toBuffer());
});
