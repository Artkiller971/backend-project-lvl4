install:
	npm install

build:
	npm run build

start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

lint:
	npx eslint .

test:
	npm test -s