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
import argparse

from config import user
from config import password
from config import database

api = flask.Blueprint('api', __name__)
#api = flask.Flask(__name__)


#==================Connection===============
try:
    connection = psycopg2.connect(database=database, user=user, password=password)
except Exception as e:
    print("Error: problem with configuration", file=sys.stderr)
    print(e)
    exit()

#================Reusable Functions================

def send_query(query):
#Send the query statement and get the cursor.
    try:
        cursor = connection.cursor()
        cursor.execute(query)
    except Exception as e:
        print(e)
        exit()
    return cursor

def dropdown_options(variable_name):
    # return the all possible values for a specified variable
    # Normally stored in table variable_name.type, except for booleans
    list_to_show = []
    column_name = 'type'
    # print(variable_name)
    if variable_name == 'boolean_match':
        column_name = 'boolean'
    query = 'SELECT ' + column_name + ' FROM '+ variable_name
    values = send_query(query)
    for option in values:
        list_to_show.append(option[0]) # Note that 'option' is a list with length 1.
    return json.dumps(list_to_show)

def get_condition(variable_name):
    # return the requested value of the variable
    # Ex: For an endpoint ..../...?flee=foot&body_camera=true,
    # when 'flee' is given as a parameter, this function will return 'foot'.
    # When the value is 'none', return ''.
    var_value = flask.request.args.get(variable_name)
    if var_value == None:
        return ''
    else:
    	return var_value

def search_by_given_conditions():
    # Variable names of searching conditions:
    # ID, date, signs_of_mental_illness, threat_level, flee, body_camera, manner_of_death, arm_category
    # While 'State' is not considered as a searching criteria in this method, it will be returned as a case detail together with the other info mentioned.
    
#    query = '''SELECT incidents.id, incidents.date, signs_of_mental_illness.type, threat_level.type, flee.type, body_camera.type, manner_of_death.type, arm_category.type, states.state
#               FROM incidents, signs_of_mental_illness, body_camera, threat_level, flee, manner_of_death, arm_category, states, locations
#               WHERE incidents.id = locations.id
#                 AND locations.state = states.id
#            '''

    query = '''
            SELECT states.state, states.state_full_name, incidents.date, victims.full_name, gender.type AS gender, race.type AS race, victims.age, signs_of_mental_illness.type AS mental_illness, threat_level.type AS threat_level, flee.type AS flee, body_camera.type AS body_camera, manner_of_death.type AS manner_of_death, arm_category.type AS arm_category
            FROM incidents, locations, states, victims, gender, race, signs_of_mental_illness, threat_level, flee, body_camera, manner_of_death, arm_category
            WHERE incidents.id = locations.id
            AND incidents.id = victims.id
            AND locations.state = states.id
            AND victims.gender = gender.id
            AND victims.race = race.id
            AND incidents.signs_of_mental_illness = signs_of_mental_illness.id
            AND incidents.threat_level = threat_level.id
            AND incidents.flee = flee.id
            AND incidents.body_camera = body_camera.id
            AND incidents.manner_of_death = manner_of_death.id
            AND incidents.arm_category = arm_category.id

    '''
    
    conditions = ['signs_of_mental_illness','threat_level','flee','body_camera','manner_of_death','arm_category']
    
    conditions_dict = {}

    for variable_name in conditions:
        
        conditions_dict[variable_name] = flask.request.args.get(variable_name)
        
    for variable_name, variable_value in conditions_dict.items():
        if variable_value != None:
            variable_value = str(variable_value)
            query += f'\nAND {variable_name}.type = \'{variable_value}\''
        else:
            continue
    
    query += '\nORDER BY incidents.date LIMIT 20'
    cases_total = send_query(query) # type: cursor
    return cases_total


#=================================== Endpoint Implements=============================================

@api.route('/cases/total') # EXAMPLE: ?signs_of_mental_illness=True&flee=Car&arm_category=none&body_camera=True&threat_level=none&manner_of_death=none
# The order of variable names does not matter, but every one of them must appear exactly once. ('xxx=none' as the place holder)
def cases_total_by_condtion():
    '''
    RESPONSE: Return a json dictionary list of cases which meet the specified criteria.
    Each dictionary of cases contains the following fields: ID, date,
    signs_of_mental_illness, threat_level, flee, body_camera, manner_of_death,
    arm_category, state_abbreviation.

    Example: baseURL/cases/total?signs_of_mental_illness=true&flee=car&threat_level=none
    &body_camera=none&manner_of_death=none&arm_category=none will show all the cases' info
    in the fields above, filtered by signs_of_mental_illness=true and flee=car.
    '''
    
    query = '''
            SELECT states.state, states.state_full_name, incidents.date, victims.full_name, gender.type AS gender, race.type AS race, victims.age, signs_of_mental_illness.type AS mental_illness, threat_level.type AS threat_level, flee.type AS flee, body_camera.type AS body_camera, manner_of_death.type AS manner_of_death, arm_category.type AS arm_category
            FROM incidents, locations, states, victims, gender, race, signs_of_mental_illness, threat_level, flee, body_camera, manner_of_death, arm_category
            WHERE incidents.id = locations.id
            AND incidents.id = victims.id
            AND locations.state = states.id
            AND victims.gender = gender.id
            AND victims.race = race.id
            AND incidents.signs_of_mental_illness = signs_of_mental_illness.id
            AND incidents.threat_level = threat_level.id
            AND incidents.flee = flee.id
            AND incidents.body_camera = body_camera.id
            AND incidents.manner_of_death = manner_of_death.id
            AND incidents.arm_category = arm_category.id
    '''
    
    conditions = ['signs_of_mental_illness','threat_level','flee','body_camera','manner_of_death','arm_category']
    
    conditions_dict = {}

    for variable_name in conditions:
        conditions_dict[variable_name] = flask.request.args.get(variable_name)
        
    for variable_name, variable_value in conditions_dict.items():
        if variable_value != None:
            variable_value = str(variable_value)
            query += f'\nAND {variable_name}.type = \'{variable_value}\''
        else:
            continue
            
    query += '\nORDER BY incidents.date'
    cases_total = send_query(query)
    
#====================================================================

    list_of_dict = []

    for case in cases_total:
        case_dict = {}
        case_dict['state_abbreviation'] = case[0]
        case_dict['state'] = case[1]
        case_dict['date'] = case[2].isoformat()
        case_dict['full_name'] = case[3]
        case_dict['gender']  = case[4]
        case_dict['race'] = case[5]
        case_dict['age']  = case[6]
        case_dict['signs_of_mental_illness'] = case[7]
        case_dict['threat_level'] = case[8]
        case_dict['flee'] = case[9]
        case_dict['body_camera'] = case[10]
        case_dict['manner_of_death'] = case[11]
        case_dict['arm_category'] = case[12]

        list_of_dict.append(case_dict)
        
    return json.dumps(list_of_dict)


@api.route('/cases/states/<state_abbreviation>/cumulative') 
def cases_summary_by_state(state_abbreviation):
    '''
    RESPONSE:
    '''
    query = '''
            SELECT states.state, states.state_full_name, COUNT(incidents.id)
            FROM incidents, locations, states, victims
            WHERE incidents.id = locations.id
            AND incidents.id = victims.id
            AND locations.state = states.id
    '''
    query += f'\n AND states.state = \'{state_abbreviation}\' GROUP BY states.state, states.state_full_name'
    
    cursor = send_query(query).fetchone()

    case_dict = {}
    case_dict['state_abbreviation'] = cursor[0]
    case_dict['state'] = cursor[1]
    case_dict['total_cases'] = cursor[2]
        
    return json.dumps(case_dict)
    
    
@api.route('/cases/states/<state_abbreviation>/annual')
def cases_annual_summary_by_state(state_abbreviation):
    '''
    RESPONSE:
    '''
    query_total = '''
            SELECT states.state, states.state_full_name, COUNT(incidents.id)
            FROM incidents, locations, states, victims
            WHERE incidents.id = locations.id
            AND incidents.id = victims.id
            AND locations.state = states.id
    '''
    query_total += f'\n AND states.state = \'{state_abbreviation}\' GROUP BY states.state, states.state_full_name'
    
    cursor = send_query(query_total).fetchone()

    case_dict = {}
    case_dict['state_abbreviation'] = cursor[0]
    case_dict['state'] = cursor[1]
    case_dict['total_cases'] = cursor[2]
    
    
    query_annual = '''
            SELECT COUNT(incidents.id), EXTRACT(YEAR FROM incidents.date)
            FROM incidents, locations, states
            WHERE incidents.id = locations.id
            AND locations.state = states.id    
    '''
    
    query_annual += f'\n AND states.state = \'{state_abbreviation}\' GROUP BY states.state, states.state_full_name, EXTRACT(YEAR FROM incidents.date) ORDER BY EXTRACT(YEAR FROM incidents.date)'
    
    cursor = send_query(query_annual)
    
    source_list = []
    for year in cursor:
        source_list.append(year[0])
    
    
    
    case_dict['2015'] = source_list[0]
    case_dict['2016'] = source_list[1]
    case_dict['2017'] = source_list[2]
    case_dict['2018'] = source_list[3]
    case_dict['2019'] = source_list[4]
    case_dict['2020'] = source_list[5]
    
    return json.dumps(case_dict)
    

@api.route('/cases/total/demographics/race')
def cases_by_race_by_condition():
    query = '''
            SELECT COUNT(incidents), race.type
            FROM incidents, locations, states, victims, gender, race, signs_of_mental_illness, threat_level, flee, body_camera, manner_of_death, arm_category
            WHERE incidents.id = locations.id
            AND incidents.id = victims.id
            AND locations.state = states.id
            AND victims.gender = gender.id
            AND victims.race = race.id
            AND incidents.signs_of_mental_illness = signs_of_mental_illness.id
            AND incidents.threat_level = threat_level.id
            AND incidents.flee = flee.id
            AND incidents.body_camera = body_camera.id
            AND incidents.manner_of_death = manner_of_death.id
            AND incidents.arm_category = arm_category.id
    '''
    
    conditions = ['signs_of_mental_illness','threat_level','flee','body_camera','manner_of_death','arm_category']
    
    conditions_dict = {}

    for variable_name in conditions:
        conditions_dict[variable_name] = flask.request.args.get(variable_name)
        
    for variable_name, variable_value in conditions_dict.items():
        if variable_value != None:
            variable_value = str(variable_value)
            query += f'\nAND {variable_name}.type = \'{variable_value}\''
        else:
            continue
            
    query += '\nGROUP BY race.type'
    cursor = send_query(query)
    
#====================================================================

    data = []
    labels = []
    
    for row in cursor:
        data.append(row[0])
        labels.append(row[1])
    
    dict = {}
    dict['data'] = data
    dict['labels'] = labels
            
    return json.dumps(dict)
    
    


#
# 
#if __name__ == '__main__':
#    parser = argparse.ArgumentParser('Covid19_API')
#    parser.add_argument('host', help='the host on which this application is running')
#    parser.add_argument('port', type=int, help='the port on which this application is listening')
#    arguments = parser.parse_args()
#    api.run(host=arguments.host, port=arguments.port, debug=True)
