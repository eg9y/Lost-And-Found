# ~~Lost~~ and Found
Pin your lost and found items in the UCSC campus map!

![Cite Homepage](https://i.imgur.com/CeFbunj.png "Cite Homepage")

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installation
1. Install Node.js
2. In your preferred directory, clone this repository
3. Install dependencies via NPM:
```
npm install --only=production
```
4. create a `dev.env.js` file in the `config` folder, and fill in the following:
```javascript
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_KEY: '"YOUR FIREBASE API KEY"',
  AUTH_DOMAIN: '"YOUR FIREBASE PROJECT DOMAIN"',
  DB_URL: '"YOUR FIREBASE DB URL"',
  PROJECT_ID: '"YOUR FIREBASE PROJECT ID"',
  STORAGE_BUCKET: '"YOUR FIREBASE STORAGE BUCKET"',
  MESSAGING_SENDER_ID: '"YOUR MESSAGIN SENDER ID"',
})
```
To build for production, you can also add `prod.env.js` in `config` and fill in the following: 
```javascript
'use strict'

module.exports = {
  NODE_ENV: '"production"',
  API_KEY: '"YOUR FIREBASE API KEY"',
  AUTH_DOMAIN: '"YOUR FIREBASE PROJECT DOMAIN"',
  DB_URL: '"YOUR FIREBASE DB URL"',
  PROJECT_ID: '"YOUR FIREBASE PROJECT ID"',
  STORAGE_BUCKET: '"YOUR FIREBASE STORAGE BUCKET"',
  MESSAGING_SENDER_ID: '"YOUR MESSAGIN SENDER ID"',
}
```
5. Run the application locally (hosted at localhost:8080):
```
npm start
```

## Development Setup
1. Install all dependecies (including dev dependencies) via NPM:
```
npm install
```
## Running the tests
tests can be found in the `test` folder. We chose `Mocha` as our testing framework, and `Karma` as test runner 
1. Run the automated test via:
```
npm install
npm run unit
```

### Authors
* Geoff Huang
* Lily Nguyen
* Chengyu Jiang
* Wan Fong
* Egan Bisma
* Peter Eskraus
