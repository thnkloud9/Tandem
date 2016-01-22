db.questions.find({
  "$and":[
    {"tags":{"$ne": new ObjectId("568a9827ac6c1d68fddfc95d") }},
    {"$or":[
        {"text.translations.en":{"$regex":".*If you had intro.*","$options":"i"}},
        {"text.translations.de":{"$regex":".*Häatten Sie Intro.*","$options":"i"}},
        {"tags_index":{"$regex":".*mus.*","$options":"i"}}
     ]}
  ]
})