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
        'category': {
            'type': 'string',
            'allowed': ['word','phrase'],
            'default': 'phrase'
        },
        'status': {
            'type': 'string',
            'allowed': ['submitted','approved','rejected'],
            'default': 'submitted'
        },
        'repeatable': {
            'type': 'boolean',
            'default': False
        },
        'tags': {
            'type': 'list',
            'schema': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'tags',
                    'field': '_id',
                    'embeddable': True
                }
            }
        },
        'tags_index': {
            'type': 'string'
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
