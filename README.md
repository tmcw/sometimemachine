# sometimemachine

Analysis of OpenStreetMap History.

[Latest weekly changesets](http://planet.openstreetmap.org/) on
`planet.openstreetmap.org` includes all changesets for the recorded
history of OpenStreetMap as a 4.2G XML file.

Changesets have:

* uid
* id
* bbox
* num_changes
* date_opened
* date_closed

This code is inspired by [ChangesetMD](https://github.com/ToeBee/ChangesetMD),
with a few differences:

* SQLite instead of Postgres
* expat instead of sax.handler
* more compact schema for smaller databases
* BSD instead of GPL

Initialize an SQLite file:

    cat schema.sql | sqlite3 changesets.sqlite

Import a changeset dump into sqlite:

    python stm.py changesets-latest.osm changesets.sqlite

 Indexes

     create index uid_idx on osm_changeset (user_id);

## Products

`unique_per_day.js`

* [Active Contributors Per Month](http://bl.ocks.org/3750490)
* [Active Contributors Per Day](http://bl.ocks.org/3750519)

`two_edit_per_month.js`

* [Contributors by Level By Month](http://bl.ocks.org/3751212)
* [up to 10 edits](http://bl.ocks.org/3751255)

## Graphs

These guys you can generate with scripts but are too heavy to put on gist.

When users register versus how likely they are to contribute for more than
a year. Nearly all of the early users of OpenStreetMap contributed more
than a year, while users who started contributing 2 years ago are much
less likely.

![](https://raw.github.com/tmcw/sometimemachine/master/lifetime/graph.png)

Changesets in the last 3 months (dark red), last year (orange), all time
(light orange)

![](https://raw.github.com/tmcw/sometimemachine/master/changesets_month.png)

User lives histogram. Of course, the vast majority of users last less than
two days. It's an exponential distribution from there on with no clear peaks.

![](https://raw.github.com/tmcw/sometimemachine/master/lives/user_lives.png)
