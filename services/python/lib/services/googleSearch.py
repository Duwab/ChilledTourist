import requests, json
from flask import current_app
from lib.models import GoogleRequest
from lib.models import Place
from src.app import db
from time import sleep

# http://docs.python-requests.org/en/latest/user/quickstart/#make-a-post-request
# http://flask-sqlalchemy.pocoo.org/2.1/quickstart/#a-minimal-application

DEFAULT_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

def getSearch(keyword = ''):
    if not isinstance(keyword, basestring):
        keyword = ''
    params = generateParameters(keyword)
    previousSearch = getCache(params)
    if (not previousSearch) or (previousSearch is None):
        places = fetchPlaces(params)
        persistCache(params, places)
    else:
        print "!! value from cache"
        places = [place.dict for place in previousSearch.places]
    return places

def fetchPlaces(payload):
    places, next_page_token = performRequest(payload)
    # print 'next_page_token: ' + next_page_token
    i = 0
    while (i < 10) and (next_page_token is not None):
        print 'request next'
        sleep(2)
        nextPlaces, next_page_token = performRequest({
            'pagetoken': next_page_token
        })
        if (nextPlaces is not None):
            places = places + nextPlaces
        i += 1
    return places

def performRequest(payload):
    payload['key'] = current_app.config.get('GOOGLE_API_KEY_SEARCH')
    print '\n\nnew request'
    # print payload
    try:
        if 'pagetoken' in payload:
            print 'performing next page request'

        res = json.loads(requests.get(DEFAULT_URL, params=payload).content)

        if 'pagetoken' in payload:
            print 'response for request with token is ' + res['status']

        if 'next_page_token' in res:
            next_page_token = res['next_page_token']
            print 'res next_page_token: ' + next_page_token
        else:
            next_page_token = None
            print 'no next page token'
        return (res['results'], next_page_token)
    except Exception as inst:
        print "Request to google error:"
        print inst
        return None

def getCache(params):
    # print params
    if 'name' in params:
        keyword = params['name']
    else:
        keyword = ''
    return GoogleRequest.findByKeyword(keyword)

def persistCache(params, places):
    gsearch = GoogleRequest(params['name'], params['location'])
    db.session.add(gsearch)
    for result in places:
        place = Place(result['id'], result['name'], result, gsearch)
        db.session.add(place)
    db.session.commit()
    return True

def tmpSelect():
    # return Place.query.limit(100).all()
    return GoogleRequest.query.limit(10).all()

def generateParameters(name):
    params = {
        'name': name,
        'type': 'bar',
        'location':'48.85661400000001,2.3522219',
        'radius':'4000'
    }
    return params
