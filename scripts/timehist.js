var fs = require('fs');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Volumes/A/sometimemachine/changesets.sqlite');

var user_q = 'SELECT closed_at FROM osm_changeset;';
var hist = {};
db.each(user_q, function(err, row) {
    var m = moment(row.closed_at * 1000);
    var mins = ((m.hours() * 60) + m.minutes()) - 300;
    // wrap around
    if (mins < 0) mins += 1440;
    if (hist[mins] === undefined) hist[mins] = 0;
    hist[mins]++;
}, function() {
    fs.writeFileSync('timehist.json', JSON.stringify(hist));
});
