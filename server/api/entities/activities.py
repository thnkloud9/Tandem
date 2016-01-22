entity = {
    'schema': {
        'action': {
            'type': 'string',
            'allowed': [
                'rated',
                'commented',
                'created',
                'completed',
                'added audio',
            ]
        },
        'status': {
            'type': 'string',
            'allowed': ['submitted','approved','rejected'],
            'default': 'submitted'
        },
        'language': {
            'type': 'string'
        },
        'context': {
            'type': 'string',
            'allowed': ['question','answer','practice_set', 'practice_session', 'comment'],
        },
        'affected_object': {
            'type': 'objectid',
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
            }
        }
    },
    'allowed_roles': ['user', 'trusted', 'admin'],
    'resource_methods': ['GET', 'POST'],
    'item_methods': ['GET', 'PUT', 'PATCH', 'DELETE']
}
