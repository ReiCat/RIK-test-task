import ujson
import tornado

from handlers import RequestHandler

class CompanyHandler(RequestHandler):
    async def get(self):
        return self.write_response(data="ASDASD")

    async def post(self):
        pass