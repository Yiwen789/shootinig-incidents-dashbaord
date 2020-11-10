'''
    books_webapp.py
    Jeff Ondich, 25 April 2016
    Updated 4 November 2020

    Tiny Flask API to support the tiny books web application.
'''
import sys
import flask
import json
import config
import psycopg2

from config import user
from config import password
from config import database

try:
    connection = psycopg2.connect(database=database, user=user, password=password)
except Exception as e:
    print("Error: problem with configuration", file=sys.stderr)
    exit()
    


api = flask.Blueprint('api', __name__)

def send_query(query):
    try:
        cursor = connection.cursor()
        cursor.execute(query)
    except Exception as e:
        print(e)
        exit()
    return cursor

@app.route('/cases/total?')#[{filter = [mental_illness | threat_level | flee | death |arms]}]
def hello():
    '''
    RESPONSE: 
    '''
    filter_dict = {'mental_illness': 'signs_of_mental_illness', 'threat_level': 'threat_level', 'flee': 'flee',
                  'camera': 'body_camera', 'death': 'manner_of_death', 'arms': 'arm_category'}
    
    filter_variables = filter_dict[flask.request.args.get('filter'), default = '', type = str]
    
#    query = f'SELECT states.state, states.state_full_name, locations.city, victims.full_name, victioms.age, victims.gender, victims.race, incidents.date, boolean_match.boolean AS mental_illness, threat_level.type, arm_category.type, flee.type, manner_of_death.type \
#            FROM incidents, states, boolean_match, threat_level, arm_category, flee, manner_of_death \
#            WHERE incidents.signs_of_mental_illness = boolean_match.id \
#            AND locations.state = states.id \
#            AND victims.gender = gender.id \
#            AND incidents.threat_level = threat_level.id \
#            AND incidents.threat_level = arm_category.id \
#            AND incidents.flee = flee.id \ 
#            AND incidents.manner_of_death = manner_of_death.id \
#            ORDER BY states.state;'

    query = f'SELECT states.state, states.state_full_name, incidents.date, victims.full_name, gender.type, race.type, victims.age \
            FROM incidents, locations, states, victims, gender, race \
            WHERE incidents.id = locations.id \ 
            AND locations.state = states.id \
            AND incidents.id = victims.id \
            AND victims.gender = gender.id ;'
    
    
    if filter_variables = {}:
        #if all dropdown menu default
        pass
    else:
        #iterate through each selected criteria and add to the sql query
        for key, val in filter_variables.items(): 
        query = 'SELECT states.state, states.state_full_name, incidents.date, victims.full_name, gender.type, race.type, victims.age \
            FROM incidents, locations, states, victims, gender, race \
            WHERE incidents.id = locations.id \ 
            AND locations.state = states.id \
            AND incidents.id = victims.id \
            AND victims.gender = gender.id'
        query = query + f'AND incidents.filter_dict[{(key)}] = val'

    cases_total = send_query(query)
    
    for case in cases_total:
        case_dict = {}
        case_dict['state_abbreviation'] = case[0]
        case_dict['state'] = case[1]
        case_dict['date'] = case[2]
        case_dict['full_name'] = case[3]
        case_dict['gender']  = case[4]
        case_dict['race'] = case[5]
        case_dict['age']  = case[6]
        #case_dict['sings_of_mental_illness'] = case[3]
        #case_dict['threat_level'] =
        #case_dict['armed'] =
#        case_dict['arm_category'] =
#        case_dict['flee'] =
#        case_dict['manner_of_death'] =
        #case_dict['body_camera'] =
    
    return json.dumps(cases_total)

