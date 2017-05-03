import json
from datetime import datetime
from src.app import db

class GoogleRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(255))
    location = db.Column(db.String(127))
    date_create = db.Column(db.DateTime)

    def __init__(self, keyword, location):
        self.keyword = keyword
        self.location = location
        self.date_create = datetime.utcnow()

    def __repr__(self):
        return '<GSearch %r>' % self.keyword

    @classmethod
    def findByKeyword(cls, keyword):
        print 'search keyword: ' + keyword
        found = GoogleRequest.query.filter_by(keyword=keyword).order_by(GoogleRequest.id.desc()).first()
        if found is not None:
            print 'found'
        else:
            print 'not found'
        # print found
        return found

    @property
    def dict(self):
        places = self.places.all()
        print places
        return {
            'id': self.id,
            'keyword': self.keyword,
            'location': self.location,
            'places': [place.dict for place in places]
        }
