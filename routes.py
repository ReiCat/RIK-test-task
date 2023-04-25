import os
import tornado.web

import settings
from handlers.react_handler import ReactHandler
from handlers.company_handler import CompanyHandler
from handlers.company_search_handler import CompanySearchHandler

routes = [
    tornado.web.url(r"/", ReactHandler),
    tornado.web.url(r"/static/(.*)", tornado.web.StaticFileHandler,
                    {'path': os.path.join(settings.STATIC_PATH, 'static')}),
    tornado.web.url(r"/api/company", CompanyHandler),
    tornado.web.url(r"/api/search", CompanySearchHandler),
]