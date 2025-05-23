install:
	npm install

build:
	npm run build

start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

migrate:
	npx knex migrate:latest

migrate-prod:
	NODE_ENV=production npx knex migrate:latest

lint:
	npx eslint .

test:
	npm test -s