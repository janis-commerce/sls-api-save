# Serverless API Save

[![Build Status](https://travis-ci.org/janis-commerce/sls-api-save.svg?branch=master)](https://travis-ci.org/janis-commerce/sls-api-save)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/sls-api-save/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/sls-api-save?branch=master)

An integration handler for Serverless and JANIS Views API Save

# Installation

```
npm install @janiscommerce/sls-api-save
```

# Usage

- API Save Data
```js
'use strict';

const { SlsApiSaveData } = require('@janiscommerce/sls-api-save');

module.exports.handler = (...args) => SlsApiSaveData.handler(...args);
```


# Function minimal configuration

```yml
functions:
  ViewsSaveCreateApi:
    handler: path/to/your.handler
    events:
      - http:
          integration: lambda
          path: view/{entity}/save/data
          method: POST
          request:
            parameters:
              paths:
                entity: true

  ViewsSaveEditApi:
    handler: path/to/your.handler
    events:
      - http:
          integration: lambda
          path: view/{entity}/save/data/{entityId}
          method: PUT
          request:
            parameters:
              paths:
                entity: true
                entityId: true
```