start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

db-migrate:
	npx knex migrate:latest

seed:
	npx knex seed:make dev

run-seed:
	npx knex seed:run
