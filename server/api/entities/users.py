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
        'first_name': {
            'type': 'string'
        },
        'last_name': {
            'type': 'string'
        },
        'city': {
            'type': 'string'
        },
        'country': {
            'type': 'string'
        },
        'introduction': {
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
