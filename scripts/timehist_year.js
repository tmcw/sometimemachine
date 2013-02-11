var fs = require('fs');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Volumes/A/sometimemachine/changesets.sqlite');

var user_q = 'SELECT closed_at FROM osm_changeset;';
var years = {};
db.each(user_q, function(err, row) {
    var m = moment(row.closed_at * 1000);
    var mins = ((m.hours() * 60) + m.minutes()) - 300;
    var y = m.year();
    if (mins < 0) mins += 1440;
    if (years[y] === undefined) years[y] = {};
    if (years[y][mins] === undefined) years[y][mins] = 0;
    years[y][mins]++;
}, function() {
    fs.writeFileSync('timehist_year.json', JSON.stringify(years));
});
