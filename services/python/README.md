# Python API
This API is expected to be the "Intelligence" part of the global application.
Python allows to use mathematical libraries to perform machine learning.
It can also be used to trigger spark processes for large amount of data.


## Run
```
pip install -r requirements.txt
gunicorn -b 0.0.0.0:8000 --reload --access-logfile - "src.app:create_app()"
```
