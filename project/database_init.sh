#!/bin/bash
rm -rf PGDATA
initdb PGDATA
postgres -D PGDATA
