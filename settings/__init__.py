LOCAL_SETTINGS = 'custom'
try:
    module = __import__('settings.' + LOCAL_SETTINGS,
                        globals(), locals(), ['*'])
    for k in dir(module):
        locals()[k] = getattr(module, k)
except ImportError:
    from settings.defaults import *
