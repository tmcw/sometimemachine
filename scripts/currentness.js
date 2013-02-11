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

ctx.fillStyle = '#fee8c8';
db.each("SELECT lon, lat FROM osm_changeset where closed_at < 1325397600;", function(err, row) {
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
    ctx.fillStyle = '#fdbb84';
    console.log('done with before');
    drawn = {};
    db.each("SELECT lon, lat FROM osm_changeset where closed_at > 1325397600;", function(err, row) {
        var xp = Math.floor(x(row.lon));
        var yp = Math.floor(y(row.lat));
        var k = xp + ' ' + yp;
        if (drawn[k]) return;
        ctx.fillRect(
            xp,
            yp,
            block + 1, block + 1);
    }, function() {
            fs.writeFileSync('changesets_2012.png', c.toBuffer());
            ctx.fillStyle = '#e34a33';
            console.log('done with 2012');
            drawn = {};
            db.each("SELECT lon, lat FROM osm_changeset where closed_at > 1338526800;", function(err, row) {
                var xp = Math.floor(x(row.lon));
                var yp = Math.floor(y(row.lat));
                var k = xp + ' ' + yp;
                if (drawn[k]) return;
                ctx.fillRect(
                    xp,
                    yp,
                    block + 1, block + 1);
            }, function() {
                console.log('done with month');
                fs.writeFileSync('changesets_month.png', c.toBuffer());
            });
    });
});
