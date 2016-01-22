entity = {
    'schema': {
        'context': {
            'type': 'string',
            'allowed': ['text', 'question','answer','comment'],
            'required': True
        },
        'parent' : {
            'type': 'objectid',
            'required': True
        },
        'progress': {
            'type': 'float'
        },
        'status': {
            'type': 'string',
            'allowed': ['submitted','approved','rejected'],
            'default': 'submitted'
        },
        'language_code': {
            'type': 'string',
            'allowed': ['en', 'de', 'es'],
            'required': True
        },
        'tags': {
            'type': 'list'
        },
        'text': {
            'type': 'string'
        },
        'affected_user': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'users',
                'field': '_id',
                'embeddable': True
            }
        },
        'username': {
            'type': 'string'
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
