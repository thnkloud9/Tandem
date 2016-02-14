entity = {
    'schema': {
        'text': {
            'type': 'dict',
            'schema': {
                'languages': {
                    'type': 'integer',
                    'required': True
                },
                'original_language': {
                    'type': 'string',
                    'required': True
                },
                'translations': {
                    'type': 'dict',
                    'required': True
                }
            }
        },
        'status': {
            'type': 'string',
            'allowed': ['submitted','approved','rejected'],
            'default': 'submitted'
        },
        'icon': {
            'type': 'string',
            'default': ''
        },
        'image': {
            'type': 'media',
            'default': ''
        },
        'description': {
            'type': 'dict',
            'schema': {
                'languages': {
                    'type': 'integer',
                    'default': 2 
                },
                'original_language': {
                    'type': 'string',
                    'default': 'en' 
                },
                'translations': {
                    'type': 'dict',
                    'default': {}
                }
            }
        },
        'search_index': {
          'type': 'list',
          'schema': {
            'type': 'string'
          }
        }, 
        'submitted_by' : {
            'type': 'objectid',
            'data_relation': {
                'resource': 'users',
                'field': '_id',
                'embeddable': True
            }
        }
    },
    'allowed_roles': ['user', 'trusted', 'admin'],
    'resource_methods': ['GET', 'POST'],
    'item_methods': ['GET', 'PUT', 'PATCH', 'DELETE']
}
