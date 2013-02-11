var Canvas = require('canvas'),
    fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var hist = [];

db.each("select sum(num_changes) as n from osm_changeset;", function(err, row) {
    var total = row.n;
    db.each("select sum(num_changes) as n from osm_changeset GROUP BY user_id;", function(err, row) {
        hist.push(row.n);
    }, function() {
        hist.sort(function(a, b) { return a - b; });
        fs.writeFileSync('num_changes.json', JSON.stringify(hist));
    });
});
