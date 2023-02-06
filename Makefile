start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

db-migrate:
	npx knex migrate:latest

db-migrate-prod:
	npx knex migrate:latest --env production

seed:
	npx knex seed:make dev

run-seed:
	npx knex seed:run

test:
	npm test -s