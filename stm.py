#!/usr/bin/env python3

import sqlite3, sys
import xml.parsers.expat
from dateutil.parser import parse

if (len(sys.argv) < 2):
    raise 'Usage: stm.py changeset.osm db.sqlite'

osm_filename = sys.argv[1]
sqlite_filename = sys.argv[2]

print("piping %s -> %s" % (osm_filename, sqlite_filename))

conn = sqlite3.connect(sqlite_filename)

cur = conn.cursor()
tmp_attrib_id = -1
# Optimize connection
cur.execute("""PRAGMA synchronous=0""")
cur.execute("""PRAGMA locking_mode=EXCLUSIVE""")
cur.execute("""PRAGMA journal_mode=DELETE""")

query = """insert into osm_changeset
    (rowid, user_id, min_lon, min_lat, max_lon, max_lat, closed_at, num_changes)
    values (?, ?, ?, ?, ?, ?, ?, ?)"""


update_query = """update osm_changeset SET msg=? WHERE rowid = ?"""

def save(attrib):
    attrib_id = int(attrib['id'])
    cur.execute(query,
        (attrib_id,
        int(attrib.get('uid', -1)),
        float(attrib.get('min_lon', 0)),
        float(attrib.get('min_lat', 0)),
        float(attrib.get('max_lon', 0)),
        float(attrib.get('max_lat', 0)),
        int(parse(attrib["created_at"]).strftime('%s')),
        int(attrib['num_changes'])))
    if (attrib_id % 100000 == 0):
        conn.commit()
        print("%d done" % int(attrib['id']))


def start_element(name, attrs):
    global tmp_attrib_id
    if name == 'changeset':
        save(attrs)
        tmp_attrib_id = attrs['id']
    elif name == 'tag' and attrs['k'] =='comment':
        cur.execute(update_query,(str(attrs['v']),int(tmp_attrib_id)))

def end_element(name):
    if name == 'changeset':
        tmp_attrib_id=-1


p = xml.parsers.expat.ParserCreate()
p.StartElementHandler = start_element
p.EndElementHandler = end_element

p.ParseFile(open(osm_filename, 'rb'))
conn.commit()
