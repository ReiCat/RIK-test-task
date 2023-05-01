import tornado.web
import tornado.template

import settings

class ASDASDHandler(tornado.web.RequestHandler):
    async def get(self):
        t = tornado.template.Loader(settings.STATIC_PATH)
        self.write(t.load("persons.html").generate())
