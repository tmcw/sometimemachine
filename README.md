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
