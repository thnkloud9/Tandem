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
