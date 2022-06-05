## enviroment variables
### dotenv
npm install dotenv --save
```ts
console.log('No value for FOO yet:', process.env.FOO);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('Now the value for FOO is:', process.env.FOO);
```
.env
```
FOO=bar
```

node -r dotenv/config dotenv-example.js →上のtsファイル例のようにしなくとも.envがprocess.envに置き換わる

### node-env-run
npm install node-env-run --save-dev

node_modules/.bin/nodenv nodenv-example.js

"main": "nodenv-example.js",
  "scripts": {
    "start": "node .",
    "start:dev": "nodenv -f ."
  },
  "devDependencies": {
    "node-env-run": "^2.0.1"

### per-env
npm install per-env --save

/ If NODE_ENV is missing, defaults to "development".
    "build": "per-env",
    "build:development": "webpack -d --watch",
    "build:staging": "webpack -p",
    "build:production": "webpack -p",

### debug
npm install debug
https://www.npmjs.com/package/debug

### unicode
password
/^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$/
