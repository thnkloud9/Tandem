entity = {
    'schema': {
        'context': {
            'type': 'string',
            'allowed': ['question','answer','comment'],
            'required': True
        },
        'question' : {
            'type': 'objectid',
            'data_relation': {
                'resource': 'questions',
                'field': '_id',
                'embeddable': True
            },
            'required': True
        },
        'parent_audio': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'audio',
                'field': '_id',
                'embeddable': True
            }
        },
        'affected_user': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'users',
                'field': '_id',
                'embeddable': True
            }
        },
        'audio': {
            'type': 'media',
            'required': True
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
        'question_text': {
            'type': 'string'
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
            },
            'required': True
        }
    },
    'allowed_roles': ['user', 'trusted', 'admin'],
    'resource_methods': ['GET', 'POST'],
    'item_methods': ['GET', 'PUT', 'PATCH', 'DELETE']
}
