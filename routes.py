import os
import tornado.web

import settings
from handlers.react_handler import ReactHandler
from handlers.companies_handler import CompaniesHandler
from handlers.company_handler import CompanyHandler
from handlers.company_search_handler import CompanySearchHandler
from handlers.shareholders_handler import ShareholdersHandler
from handlers.shareholder_handler import ShareholderHandler

routes = [
    tornado.web.url(r"/", ReactHandler),
    tornado.web.url(r"/static/(.*)", tornado.web.StaticFileHandler,
                    {'path': os.path.join(settings.STATIC_PATH, 'static')}),
    tornado.web.url(r"/api/companies", CompaniesHandler),
    tornado.web.url(r"/api/companies/(?P<registration_code>\d+)", CompanyHandler),
    tornado.web.url(r"/api/companies/search", CompanySearchHandler),
    tornado.web.url(r"/api/shareholders/(?P<company_registration_code>\d+)", ShareholdersHandler),
    tornado.web.url(r"/api/shareholders/(?P<personal_code>\d+)", ShareholderHandler),
]