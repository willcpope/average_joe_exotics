# import dependencies
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

from flask_cors import CORS

from config import password

# create db connection
engine = create_engine(f"postgresql+psycopg2://postgres:{password}@localhost:5432/mad_data_db")

# create base
Base = automap_base()
Base.prepare(engine, reflect=True)

# create references to each table
AC = Base.classes.Alcohol_Consumption
AP = Base.classes.Alcohol_Production
CO = Base.classes.Country
RW = Base.classes.Reviews
TD = Base.classes.Traffic_Related_Deaths

# setup Flask
app = Flask(__name__)

# add CORS support
CORS(app)

################
## Home Route ##
################

@app.route("/")
def welcome():
    return (
        f"<h1>Mad Data API Routes</h1>"
        f"/api/v1.0/alcohol_consumption<br/>"
        f"/api/v1.0/alcohol_production<br/>"
        f"/api/v1.0/country<br/>"
        f"/api/v1.0/reviews<br/>"
        f"/api/v1.0/traffic_related_deaths"
    )

###############################
## Alcohol Consumption Route ##
###############################

@app.route("/api/v1.0/alcohol_consumption")
def alcohol_consumption():
    
    session = Session(engine)

    results = session.query(CO.country_name, AC.year, AC.both_sexes, AC.male, AC.female).join(CO, AC.country_id==CO.country_id).all()

    session.close()

    data = []

    for country_name, year, both_sexes, male, female in results:
        data_dict = {}
        data_dict["country_name"] = country_name
        data_dict["year"] = year
        data_dict["both_sexes"] = both_sexes
        data_dict["male"] = male
        data_dict["female"] = female
        data.append(data_dict)

    return jsonify(data)

##############################
## Alcohol Production Route ##
##############################

@app.route("/api/v1.0/alcohol_production")
def alcohol_production():

    session = Session(engine)

    results = session.query(CO.country_name, AP.rank, AP.production_tonnes).join(CO, AP.country_id==CO.country_id).all()

    session.close()

    data = []

    for country_name, rank, production_tonnes in results:
        data_dict = {}
        data_dict["country_name"] = country_name
        data_dict["rank"] = rank
        data_dict["production_tonnes"] = production_tonnes
        data.append(data_dict)

    return jsonify(data)

###################
## Country Route ##
###################

@app.route("/api/v1.0/country")
def country():

    session = Session(engine)

    results = session.query(CO.country_id, CO.country_name).all()

    session.close()

    data = []

    for country_id, country_name in results:
        data_dict = {}
        data_dict["country_id"] = country_id
        data_dict["country_name"] = country_name
        data.append(data_dict)

    return jsonify(data)

###################
## Reviews Route ##
###################    

@app.route("/api/v1.0/reviews")
def reviews():
   
    session = Session(engine)

    results = session.query(CO.country_name, RW.review_id, RW.designation, RW.points, RW.price, RW.province, RW.region_1, RW.region_2, RW.variety, RW.winery).join(CO, RW.country_id==CO.country_id).all()

    session.close()

    data = []

    for country_name, review_id, designation, points, price, province, region_1, region_2, variety, winery in results:
        data_dict={}
        data_dict["country_name"] = country_name
        data_dict["review_id"] = review_id
        data_dict["designation"] = designation
        data_dict["points"] = points
        data_dict["price"] = price
        data_dict["province"] = province
        data_dict["region_1"] = region_1
        data_dict["region_2"] = region_2
        data_dict["variety"] = variety
        data_dict["winery"] = winery
        data.append(data_dict)

    return jsonify(data)

##################################
## Traffic Related Deaths Route ##
##################################

@app.route("/api/v1.0/traffic_related_deaths")
def traffic_related_deaths():
    
    session = Session(engine)

    results = session.query(CO.country_name, TD.fatalaties_100K_people_per_year, TD.fatalities_100K_mv_per_year, TD.year).join(CO, TD.country_id==CO.country_id).all()

    session.close()

    data = []

    for country_name, fatalities_100K_people_per_year, fatalities_100K_mv_per_year, year in results:
        data_dict = {}
        data_dict["country_name"] = country_name
        data_dict["fatalities_100K_people_per_year"] = fatalities_100K_people_per_year
        data_dict["fatalities_100K_mv_per_year"] = fatalities_100K_mv_per_year
        data_dict["year"] = year
        data.append(data_dict)

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)