"""
    ToDo:
        Create init function
        Create routes for each table
        SQL joins to add country name
"""

import numpy as np


import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

engine = create_engine(f"postgresql+psycopg2://postgres:{password}@localhost:5432/mad_data_db")

print(engine.table_names())