#!/usr/bin/env python

import sqlite3, sys
import xml.parsers.expat
from dateutil.parser import parse

if (len(sys.argv) < 2):
    raise 'Usage: stm.py changeset.osm db.sqlite'

osm_filename = sys.argv[1]
sqlite_filename = sys.argv[2]

print "piping %s -> %s" % (osm_filename, sqlite_filename)

conn = sqlite3.connect(sqlite_filename)

cur = conn.cursor()

# Optimize connection
cur.execute("""PRAGMA synchronous=0""")
cur.execute("""PRAGMA locking_mode=EXCLUSIVE""")
cur.execute("""PRAGMA journal_mode=DELETE""")

query = """insert into osm_changeset
    (rowid, user_id, lon, lat, closed_at, num_changes)
    values (?, ?, ?, ?, ?, ?)"""

def save(attrib):
    if attrib.has_key('min_lat'):
        lat = round((float(attrib['min_lat']) + float(attrib['max_lat'])) / 2.0)
        lon = round((float(attrib['min_lon']) + float(attrib['max_lon'])) / 2.0)
    else:
        lat = 0
        lon = 0
    attrib_id = int(attrib['id'])
    cur.execute(query,
        (attrib_id,
        int(attrib.get('uid', -1)),
        lon,
        lat,
        int(parse(attrib["created_at"]).strftime('%s')),
        int(attrib['num_changes'])))
    if (attrib_id % 100000 == 0):
        conn.commit()
        print "%d done" % int(attrib['id'])

def start_element(name, attrs):
    if name == 'changeset':
        save(attrs)

p = xml.parsers.expat.ParserCreate()
p.StartElementHandler = start_element

p.ParseFile(open(osm_filename))
