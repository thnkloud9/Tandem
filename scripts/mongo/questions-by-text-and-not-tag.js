db.questions.find(  
{"$and":[{"tags":{"$ne":"568a9827ac6c1d68fddfc95d"}},{"$or":[{"text.translations.en":{"$regex":".*m.*","$options":"i"}},{"text.translations.de":{"$regex":".*m.*","$options":"i"}},{"tags_index":{"$regex":".*m.*","$options":"i"}}]}]}
)