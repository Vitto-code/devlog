# Atalhos padronizados. Equivalentes npm no README (Make e opcional no Windows).

.PHONY: setup dev build test lint run clean

setup:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test:coverage

lint:
	npm run lint

run: build
	docker compose up --build app

clean:
	rm -rf .next coverage public/search-index.json
