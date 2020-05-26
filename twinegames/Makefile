SHELL=/usr/bin/env fish

SNOWMAN_DIR = ~/src/ref/snowman
TWEEGO_DIR = ~/src/ref/tweego
DEPLOY_DIR = $(shell pwd)

.PHONY: example snowman tweego build dev kid toriel dummy jerry sans end

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

example:
	$(TWEEGO_DIR)/tweego -o example.html example

deploy:
	scp -r datenrule.html $(USER)@datenrule.com:$(DEPLOY_DIR)

build:
	$(TWEEGO_DIR)/tweego -o datenrule.html datenrule

dev:
	$(TWEEGO_DIR)/tweego -w -o datenrule.html datenrule

toriel:
	$(TWEEGO_DIR)/tweego -s Toriel -w -o datenrule.html datenrule

dummy:
	$(TWEEGO_DIR)/tweego -s DummyDateStart -w -o datenrule.html datenrule

kid:
	$(TWEEGO_DIR)/tweego -s MonsterKidDateStart -w -o datenrule.html datenrule

jerry:
	$(TWEEGO_DIR)/tweego -s JerryDateStart -w -o datenrule.html datenrule

choice:
	$(TWEEGO_DIR)/tweego -s JerryDateEnd -w -o datenrule.html datenrule

sans:
	$(TWEEGO_DIR)/tweego -s SansEnter -w -o datenrule.html datenrule

end:
	$(TWEEGO_DIR)/tweego -s SansDateScience -w -o datenrule.html datenrule
