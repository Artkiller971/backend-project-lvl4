install:
	npm install

build:
	npm run build

start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-prod:
	NODE_ENV=production npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

migrate:
	npx knex migrate:latest

migrate-prod:
	NODE_ENV=production npx knex migrate:latest

rollback-prod:
	NODE_ENV=production npx knex migrate:rollback --all

lint:
	npx eslint .

test:
	npm test -s