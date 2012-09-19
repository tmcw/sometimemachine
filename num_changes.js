var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var hist = [];

db.each("select count(distinct user_id) as n from osm_changeset GROUP BY user_id;", function(err, row) {
    hist.push(row.n);
}, function() {
    fs.writeFileSync('num_changes.json', JSON.stringify(hist));
});
