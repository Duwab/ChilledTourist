from flask import jsonify


def json_response(status, *args, **kwargs):
    """
    Return a JSON response.

    Example usage:
      render_json(404, {'error': 'Discount code not found.'})
      render_json(200, {'data': coupon.to_json()})

    :param status: HTTP status code
    :type status: int
    :param args:
    :param kwargs:
    :return: Flask response
    """
    response = jsonify(*args, **kwargs)
    response.status_code = status

    return response
