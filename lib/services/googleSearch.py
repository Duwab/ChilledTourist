import requests, json
from flask import current_app

# http://docs.python-requests.org/en/latest/user/quickstart/#make-a-post-request

DEFAULT_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

cache = False

def getSearch():
    params = generateParameters()
    value = getCache(params)
    if not value:
        value = fetchSearch(params)
        persistCache(params, value)
    else:
        print "!! value from cache"

    try:
        value = value['results']
    except:
        print "Unable to get results from value"
    return value

def fetchSearch(payload):
    res = json.loads(requests.get(DEFAULT_URL, params=payload).content)
    return res

def getCache(params):
    return cache

def persistCache(params, value):
    global cache
    cache = value
    return True

def generateParameters():
    params = {
        'key': current_app.config.get('GOOGLE_API_KEY_SEARCH'),
        'type': 'bar',
        'location':'48.85661400000001,2.3522219',
        'radius':'4000'
    }
    return params
