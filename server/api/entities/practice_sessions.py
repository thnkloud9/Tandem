entity = {
    'schema': {
        'practice_set': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'practice_sets',
                'field': '_id',
                'embeddable': True
            },
            'required': True
        },
        'status': {
            'type': 'string',
            'allowed': ['scheduled','started','completed','graded'],
            'default': 'started'
        },
        'platform': {
            'type': 'string',
            'allowed': ['web','app','mobile'],
            'default': 'web'
        },
        'audio': {
            'type': 'list',
            'schema': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'audio',
                    'field': '_id',
                    'embeddable': True
                }
            }
        },
        'answers': {
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
        'score': {
            'type': 'integer',
            'default': 0
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
