var fs = require('fs');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var hist = [];

var day = moment("01-01-2004", "MM-DD-YYYY");
var last = moment("01-02-2004", "MM-DD-YYYY");
var end = moment("01-01-2013", "MM-DD-YYYY");

function run() {
    if (last.unix() > end.unix()) {
        fs.writeFileSync('unique_per_month/day.json', JSON.stringify(hist));
        return;
    }

    db.get("select count(distinct(user_id)) as u from osm_changeset WHERE closed_at > " + day.unix() + " AND closed_at < " + last.unix() + ";", function(err, row) {
        if (row.u > 0) {
            hist.push([
                day.unix(), row.u
            ]);
        }
        day.add('days', 1);
        last.add('days', 1);
        run();
    });
}
run();
