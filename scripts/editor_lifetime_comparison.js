var fs = require('fs');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('changesets.sqlite');

var user_q = 'SELECT user_id, min(closed_at) as start, ((max(closed_at) - min(closed_at)) > 31556926) as survive FROM osm_changeset GROUP BY user_id;';
var users = [];
db.each(user_q, function(err, row) {
    users.push({
        id: row.user_id,
        survive: row.survive,
        start: row.start
    });
}, function() {
    fs.writeFileSync('lifetime/starts_compare.json', JSON.stringify(users));
});
