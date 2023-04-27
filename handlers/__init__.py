import ujson
import tornado
import logging
import traceback
import settings

from datetime import datetime
from typing import (
    Any,
    Optional,
    Awaitable,
    Callable,
    List
)

class RequestHandler(tornado.web.RequestHandler):
    PATH = ""

    def write_response(self, data: any, default=str):
        # vars - means it will normally encode data class variables into json
        # default=str - encode datetimes into str
        # default=vars - encode classes into dicts
        return self.write(ujson.dumps(data, default=default))

    def write_error(self, status_code: int, **kwargs: Any) -> None:
        # Log error traceback to logfile
        logging.exception(kwargs.get("message"))
        if self.settings.get("serve_traceback") and "exc_info" in kwargs:
            # in debug mode, try to send a traceback
            self.set_header("Content-Type", "text/plain")
            for line in traceback.format_exception(*kwargs["exc_info"]):
                self.write(line)
            self.finish()
        else:
            self.set_header("Content-Type", "application/json")
            # self.finish(
            #     "<html><title>%(code)d: %(message)s</title>"
            #     "<body>%(code)d: %(message)s</body></html>"
            #     % {"code": status_code, "message": self._reason}
            # )

            error = kwargs.get('error')
            message = kwargs.get('message')
            if error and hasattr(error, "args") and not message:
                message = ", ".join(error.args)

            self.finish({
                "timestamp": datetime.utcnow().strftime(settings.DT_FORMAT),
                "status": status_code,
                "error": error.__class__.__name__ if error else None,
                "message": message,
                "path": kwargs.get("path")
            })