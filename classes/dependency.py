from types import FunctionType


class D:
    """
    Provides convenient API for easy access to dependency functionality.
    """

    # Contains current instance.
    instance = None

    # Constructor.
    dependencies = {}

    @classmethod
    def _get_instance(cls):
        if not cls.instance:
            cls.instance = cls()
        return cls.instance

    @classmethod
    def get(cls, name, default=None):
        """
        Gets required dependency instance by given name.
        """
        data = cls._get_instance().dependencies.get(name)
        if not data:
            return default

        if not data['function']:
            data['function'] = data['initializer']()
        return data['function']

    @classmethod
    def set(cls, name, function):
        """
        Sets dependency to a given name.
        """
        if not name:
            raise StandardError('Empty dependency name provided!')

        if not isinstance(function, FunctionType):
            raise StandardError('Only functions are allowed!')

        # Create new initializer.
        cls._get_instance().dependencies[name] = {
            'initializer': function, 'function': None}


class StandardError(Exception):
    pass
