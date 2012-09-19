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
