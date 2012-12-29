VERSION := $(shell node -v)
OUTPUT := $(shell echo $(HOME)/.config/geany/tags/node.js.tags)

install:
	node index.js $(VERSION) > $(OUTPUT)

tags:
	mkdir -p dist/
	node index.js $(VERSION) > dist/node-$(VERSION).js.tags

clean:
	rm -rf tmp/
