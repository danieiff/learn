firebase init emulators

### Cli
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
