from flask import Blueprint, Flask, render_template, redirect, request, url_for
from lib.util_json import json_response
import lib.services.googleSearch as GS

demo = Blueprint('demo', __name__, template_folder='templates')

@demo.route('/test')
def test():
    return json_response(200, {'message': 'Ok Working'})

@demo.route('/suggest')
def suggest():
    return json_response(200, {
        'places': GS.getSearch()
    })

@demo.route('/more')
def more():
    return json_response(200, GS.fetchSearch())
