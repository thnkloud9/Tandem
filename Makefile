all:
    @echo "No all defined"

deploy-live:
    @echo "Pushing to live"
    @git push -f live master

update:
	@./server/scripts/virtual-env-setup.sh
    @cd client/master && npm install
    @cd client/master && bower install
    @cd client/master && gulp build
