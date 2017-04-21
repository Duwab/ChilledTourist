from flask import Blueprint, Flask, render_template, redirect, request, url_for
from lib.util_json import json_response
import lib.services.googleSearch as GS

demo = Blueprint('demo', __name__, template_folder='templates')

@demo.route('/test')
def test():
    return json_response(200, {'message': 'Ok Working'})

@demo.route('/suggest')
def suggest():
    name = request.args.get('search')
    suggestedPlaces = GS.getSearch(name)
    # print suggestedPlaces
    return json_response(200, {
        'places': suggestedPlaces
    })

@demo.route('/more')
def more():
    return json_response(200, {
        'list': [i.dict for i in GS.tmpSelect()]
    })
