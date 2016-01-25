all:
    @echo "No all defined"

deploy-live:
    @echo "Pushing to live"
    @git push -f live master

update:
    @cd client/master && npm install
    @cd client/master && bower install
