PREFIX ?= ~/.local/share/gnome-shell/extensions

TRANSLATION_ID=emoji-selector
EXTENSION_UUID=emoji-selector@maestroschan.fr
GLIB_COMPILE_SCHEMAS = /usr/bin/glib-compile-schemas
EXTENSION_INSTALL_DIR = $(PREFIX)/$(EXTENSION_UUID)

all: build install
	@echo "$(EXTENSION_FILES)"

build:
	echo "Generating .pot file..."
	./update-and-compile-translations.sh
	$(GLIB_COMPILE_SCHEMAS) ./$(EXTENSION_UUID)/schemas

install:
	@echo "Installing extension files in $(EXTENSION_INSTALL_DIR)"
	mkdir -p $(EXTENSION_INSTALL_DIR)
	cp -r ./$(EXTENSION_UUID)/* $(EXTENSION_INSTALL_DIR)

zip: build
	@echo "Creating zip file from extension"

	zip -r $(EXTENSION_UUID).zip \
		./$(EXTENSION_UUID)/*.js \
		./$(EXTENSION_UUID)/prefs.ui \
		./$(EXTENSION_UUID)/metadata.json \
		./$(EXTENSION_UUID)/stylesheet.css \
		./$(EXTENSION_UUID)/data \
		./$(EXTENSION_UUID)/schemas \
		./$(EXTENSION_UUID)/locale \
		./$(EXTENSION_UUID)/icons \