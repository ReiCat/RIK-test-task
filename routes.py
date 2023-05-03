import os
import tornado.web

import settings
from handlers.react_handler import ReactHandler
from handlers.companies_handler import CompaniesHandler
from handlers.company_handler import CompanyHandler
from handlers.company_search_handler import CompanySearchHandler
from handlers.persons_handler import PersonsHandler
from handlers.person_handler import PersonHandler
from handlers.company_shareholders_handler import CompanyShareholdersHandler
from handlers.person_shares_handler import PersonSharesHandler
from handlers.shareholder_handler import ShareholderHandler

routes = [
    tornado.web.url(r"/", ReactHandler),
    tornado.web.url(r"/static/(.*)", tornado.web.StaticFileHandler,
                    {'path': os.path.join(settings.STATIC_PATH, 'static')}),
    tornado.web.url(r"/api/persons", PersonsHandler),
    tornado.web.url(r"/api/persons/(?P<personal_code>\d+)", PersonHandler),
    tornado.web.url(r"/api/persons/(?P<personal_code>\d+)/shares", PersonSharesHandler),
    tornado.web.url(r"/api/companies", CompaniesHandler),
    tornado.web.url(r"/api/companies/search", CompanySearchHandler),
    tornado.web.url(r"/api/companies/(?P<registration_code>\d+)", CompanyHandler),
    tornado.web.url(r"/api/companies/(?P<registration_code>\d+)/shareholders", CompanyShareholdersHandler),
    tornado.web.url(r"/api/companies/(?P<registration_code>\d+)/shareholders/(?P<shareholder_code>\d+)", ShareholderHandler),
]