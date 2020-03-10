SHELL=/usr/bin/env fish

SNOWMAN_DIR = ~/src/ref/snowman
TWEEGO_DIR = ~/src/ref/tweego

.PHONY: snowman tweego build dev kid toriel dummy jerry sans

snowman:
	git clone https://github.com/videlais/snowman.git $(SNOWMAN_DIR)
	cd $(SNOWMAN_DIR)
	npm install
	npm run build

tweego:
	git clone https://github.com/tmedwards/tweego.git $(TWEEGO_DIR)
	cd $(TWEEGO_DIR)
	go get
	go build
	ln -s $(SNOWMAN_DIR)/dist/snowman-2.0.3 $(TWEEGO_DIR)/storyformats

build:
	$(TWEEGO_DIR)/tweego -f snowman-2.0.3 -o datenrule.html datenrule

dev:
	$(TWEEGO_DIR)/tweego -f snowman-2.0.3 -w -o datenrule.html datenrule

toriel:
	$(TWEEGO_DIR)/tweego -f snowman-2.0.3 -s Toriel -w -o datenrule.html datenrule

dummy:
	$(TWEEGO_DIR)/tweego -f snowman-2.0.3 -s DummyDateStart -w -o datenrule.html datenrule

kid:
	$(TWEEGO_DIR)/tweego -f snowman-2.0.3 -s MonsterKidDateStart -w -o datenrule.html datenrule

jerry:
	$(TWEEGO_DIR)/tweego -f snowman-2.0.3 -s JerryDateStart -w -o datenrule.html datenrule

sans:
	$(TWEEGO_DIR)/tweego -f snowman-2.0.3 -s JerryDateEnd -w -o datenrule.html datenrule
