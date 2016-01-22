entity = {
    'schema': {
        'username': {
             'type': 'string',
             'required': True,
         },
         'password': {
             'type': 'string',
             'required': True,
         },
         'roles': {
             'type': 'list',
             'allowed': ['user', 'trusted', 'admin']
         },
         'token': {
             'type': 'string'
         },
        'user': {
             'type': 'dict'
        }
    },
    'datasource': {
        'projection': {
            'username': 1,
            'token': 1,
            'user': 1
        }
    },
    'extra_response_fields': ['user', 'token'],
    'resource_methods': ['POST'],
    'public_methods':['POST'],
    'item_methods': ['GET', 'DELETE']
}
