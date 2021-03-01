SHELL := /bin/bash

WORKSPACE := $(PWD)
TMP_WORKSPACE := build
TMP_RESROUCES := $(TMP_WORKSPACE)

S3_BUCKET=s3-tid-lambda-functions
FUNCTION_NAME=similarweb-crawler

clean:
	test -f $(TMP_WORKSPACE)/$(FUNCTION_NAME).zip && rm $(TMP_WORKSPACE)/$(FUNCTION_NAME).zip || echo "clean"

install:
	# apt-get -y install nodejs libssl1.0-dev nodejs-dev node-gyp npm
	# brew install npm
	npm install

build: clean install
	rm -rf $(TMP_WORKSPACE)/
	mkdir -p $(TMP_WORKSPACE)/
	cp -r node_modules lib *.js $(TMP_WORKSPACE)
	rm -rf $(TMP_WORKSPACE)/node_modules/aws-sdk
	find $(TMP_WORKSPACE)/node_modules -type f -name "*.md" | xargs rm -rf
	find $(TMP_WORKSPACE)/node_modules -type d -name "test" | xargs rm -rf
	rm -rf $(TMP_WORKSPACE)/node_modules/eslint
	rm -rf $(TMP_WORKSPACE)/node_modules/eslint-*
	rm -rf $(TMP_WORKSPACE)/node_modules/pluralize
	rm -rf $(TMP_WORKSPACE)/node_modules/regexpp
	rm -rf $(TMP_WORKSPACE)/node_modules/ajv/dist/regenerator.min.js
	rm -rf $(TMP_WORKSPACE)/node_modules/puppeteer/.local-chromium
	cd $(TMP_WORKSPACE)/ && zip -r $(FUNCTION_NAME).zip *

deploy:
	aws s3 cp $(TMP_WORKSPACE)/$(FUNCTION_NAME).zip s3://$(S3_BUCKET)/$(FUNCTION_NAME).zip
	# aws lambda update-function-configuration --function-name $(FUNCTION_NAME) --environment Variables={S3_BUCKET=com.brave.research.redirections.unprocessed}
	aws lambda update-function-code --function-name $(FUNCTION_NAME) --s3-bucket $(S3_BUCKET) --s3-key $(FUNCTION_NAME).zip --region ca-central-1
