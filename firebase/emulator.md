### firebase commands
init emulators
emulator:start 
- --only {a comma-separated list}
- --inspect-functions {debug port(default 9229)} Use with Cloud Function. Functions are executed in a single process, in sequential (FIFO) order for debug
- --export-on-exit={export directory(default same one as specified `--import` flag, or nothing)} (export data on shutdown like `emulators:export`)
- --import={dir path} Import data which saved by `--export-on-exit` or `emulators:export`

emulators:exec {scriptpath}	Run the script at scriptpath after starting emulators for the Firebase products configured in firebase.json
- --ui Execution with Emulator UI

emulators:export {export_directory} Export/Import feature is for Authentication and 3 databases

### Cli Integration
- JAR files are installed and cached at ~/.cache/firebase/emulators/. Add this path to your CI cache configuration
- "only" flag: emulators:start(emulators:exec) --only (features)
- [Hosting only] Generate auth token
  - firebase login:ci
  - env var $FIREBASE_TOKEN
  - firebase emulators:exec --token "YOUR_TOKEN_STRING_HERE"

- List running emulators
curl localhost:4400/emulators

- Enable/Disable Background Function Triggers
curl -X PUT localhost:4400/functions/enable(disable)BackgroundTriggers
