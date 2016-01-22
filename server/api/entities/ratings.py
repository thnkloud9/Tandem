entity = {
    'schema': {
        'context': {
            'type': 'string',
            'allowed': ['text', 'question','answer','comment'],
            'required': True
        },
        'parent': {
            'type': 'objectid',
            'required': True
        },
        'rating': {
            'type': 'number',
            'required': True
        },
        'language_code': {
            'type': 'string',
            'allowed': ['en', 'de', 'es'],
            'required': True
        },
        'affected_user': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'users',
                'field': '_id',
                'embeddable': True
            }
        },
        'submitted_by' : {
            'type': 'objectid',
            'data_relation': {
                'resource': 'users',
                'field': '_id',
                'embeddable': True
            },
            'required': True
        }
    },
    'allowed_roles': ['user', 'trusted', 'admin'],
    'resource_methods': ['GET', 'POST'],
    'item_methods': ['GET', 'PUT', 'PATCH', 'DELETE']
}
