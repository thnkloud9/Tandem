entity = {
    'schema': {
        'title': {
            'type': 'string',
            'required': True
        },
        'category': {
            'type': 'string',
            'allowed': ['memorize','tandem','live'],
            'default': 'tandem'
        },
        'status': {
            'type': 'string',
            'allowed': ['submitted','approved','rejected'],
            'default': 'submitted'
        },
        'questions': {
            'type': 'list',
            'schema': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'questions',
                    'field': '_id',
                    'embeddable': True
                }
            }
        },
        'tags': {
            'type': 'list'
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
    'auth_field': 'submitted_by',
    'allowed_roles': ['user', 'trusted', 'admin'],
    'resource_methods': ['GET', 'POST'],
    'item_methods': ['GET', 'PUT', 'PATCH', 'DELETE']
}
