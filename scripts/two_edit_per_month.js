var fs = require('fs');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var hist = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: []
};

var day = moment("01-01-2004", "MM-DD-YYYY");
var last = moment("02-01-2004", "MM-DD-YYYY");
var end = moment("01-01-2013", "MM-DD-YYYY");

function run() {
    if (last.unix() > end.unix()) {
        var a = [];
        for (var c in hist) {
            a.push(hist[c]);
        }
        fs.writeFileSync('unique_per_month/ten_stack.json', JSON.stringify(a));
        return;
    }

    db.each("SELECT count(1) as u, c from (SELECT count(user_id) as c FROM osm_changeset WHERE closed_at > " +
            day.unix() + " AND closed_at < " + last.unix() +
            " GROUP BY user_id HAVING count(user_id) in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)) GROUP BY c;", function(err, row) {
        hist[row.c].push({
            x: day.unix(),
            y: row.u
        });
    }, function() {
        day.add('months', 1);
        last.add('months', 1);
        run();
    });
}
run();
