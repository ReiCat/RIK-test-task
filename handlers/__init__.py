import ujson
import tornado

class RequestHandler(tornado.web.RequestHandler):
    PATH = ""

    def write_response(self, data: any, default=str):
        # vars - means it will normally encode data class variables into json
        # default=str - encode datetimes into str
        # default=vars - encode classes into dicts
        return self.write(ujson.dumps(data, default=default))
