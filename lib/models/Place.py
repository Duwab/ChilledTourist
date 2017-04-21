import json
from src.app import db

class Place(db.Model):
    # __tablename__ = 'table_A'
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(255), index=True)
    name = db.Column(db.String(255))
    info = db.Column(db.Text)
    # __table_args__ = (Index('my_index', "a", "b"), )

    search_id = db.Column(db.Integer, db.ForeignKey('google_request.id'))
    search = db.relationship('GoogleRequest',
        backref=db.backref('places', lazy='dynamic'))

    def __init__(self, google_id, name, info, search):
        self.google_id = google_id
        self.name = name
        self.info = json.dumps(info, sort_keys=True)
        self.search = search

    def __repr__(self):
        return '<Place %r>' % self.google_id

    @property
    def dict(self):
        return {
            'id': self.id,
            'google_id': self.google_id,
            'name': self.name,
            'info': json.loads(self.info)
        }
