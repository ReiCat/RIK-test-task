import asyncio
from signal import SIGINT, signal
from multiprocessing import cpu_count
from concurrent.futures import ThreadPoolExecutor
import tornado

from classes.dependency import D
from settings import SERVER_ADDRESS, SERVER_PORT, DEBUG
from init import initialize

class Application(tornado.web.Application):
    _routes = None

    def __init__(self, routes):
        initialize()

        self._routes = routes

        app_settings = {
            "debug": DEBUG,
            "autoescape": "xhtml_escape",
            "autoreload": False
        }

        super(Application, self).__init__(self._routes, **app_settings)

if __name__ == "__main__":
    from routes import routes

    D.set('loop', lambda: asyncio.get_event_loop_policy().get_event_loop())
    D.set('executor', lambda: ThreadPoolExecutor(
        max_workers=cpu_count()
    ))
    
    app = Application(routes=routes)
    app.listen(
        address=SERVER_ADDRESS,
        port=SERVER_PORT
    )

    try:
        tornado.ioloop.IOLoop.current().start()
        io_loop = tornado.ioloop.IOLoop.instance()
        signal(SIGINT, lambda s, f: io_loop.stop())
    except KeyboardInterrupt:
        D.get('executor').shutdown()

        io_loop = tornado.ioloop.IOLoop.instance()
        io_loop.stop()