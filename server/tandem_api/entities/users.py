entity = {
    'schema': {
        'username': {
             'type': 'string',
             'required': True,
             'unique': True,
             },
         'password': {
             'type': 'string',
             'required': True,
         },
         'email': {
             'type': 'string'
         },
         'mobile': {
             'type': 'string'
         },
         'gender': {
             'type': 'string',
             'allowed': ['male', 'female', 'other']
         },
         'roles': {
             'type': 'list',
             'allowed': ['user', 'trusted', 'admin'],
             'required': True,
         },
         'speaks': {
             'type': 'list',
             'allowed': ['en', 'de', 'es'],
             'required': True,
         },
         'learning': {
             'type': 'list',
             'allowed': ['en', 'de', 'es'],
             'required': True,
        },
        'city': {
            'type': 'string'
        },
        'country': {
            'type': 'string'
        },
        'image': {
            'type': 'media',
            'default': ''
        },
        'points': {
            'type': 'integer',
            'default': 0 
        },
        'last_login': {
            'type': 'datetime'
        },
        'email_verified': {
            'type': 'boolean'
        },
        'mobile_verified': {
            'type': 'boolean'
        },
        'show_on_load': {
            'type': 'list'
        }
    },
    'datasource': {
        'projection': {
            'password': 0
        }
    },
    'allowed_roles': ['user', 'trusted', 'admin'],
    'extra_response_fields': ['token'],
    'resource_methods': ['GET', 'POST'],
    'public_methods':['GET', 'POST'],
    'item_methods': ['GET', 'PUT', 'PATCH', 'DELETE']
}
