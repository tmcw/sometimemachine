var Canvas = require('canvas'),
    fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var w = 20000, h = 20000;
var c = new Canvas(w, h);
var ctx = c.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);

db.get('SELECT min(closed_at) from osm_changeset LIMIT 1;', function(err, min_closed_res) {
db.get('SELECT max(closed_at) from osm_changeset LIMIT 1;', function(err, max_closed_res) {

db.get('SELECT min(user_id) from osm_changeset LIMIT 1;', function(err, min_user_res) {
db.get('SELECT max(user_id) from osm_changeset LIMIT 1;', function(err, max_user_res) {
    var min_closed = min_closed_res['min(closed_at)'];
    var max_closed = max_closed_res['max(closed_at)'];

    var min_user = min_user_res['min(user_id)'];
    var max_user = max_user_res['max(user_id)'];

    function x(closed_at) {
        return (closed_at - min_closed) / (max_closed - min_closed) * w;
    }

    function y(user_id) {
        return (user_id - min_user) / (max_user - min_user) * h;
    }

    ctx.font = '200px Helvetica';
    for (var year = 2004; year < 2013; year++) {
        var yd = (+new Date('January 1, ' + year)) / 1000;
        ctx.fillStyle = '#888';
        ctx.fillRect(~~x(yd),
            0,
            5, h);
        ctx.fillStyle = '#ccc';
        ctx.fillText(year, ~~x(yd) + 100,
            h - 300);
    }

    ctx.fillStyle = '#222';
    db.each("SELECT user_id, closed_at FROM osm_changeset", function(err, row) {
        ctx.fillRect(
            ~~x(row.closed_at),
            ~~y(row.user_id),
            1, 1);
    }, function() {
        fs.writeFileSync('changesets.png', c.toBuffer());
    });
});
});

});
});
