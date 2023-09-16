`firebase emulators:start --project demo-*`

### firebase commands
init emulators
emulator:start 
- --only {a comma-separated list}
- --inspect-functions {debug port(default 9229)} Use with Cloud Function. Functions are executed in a single process, in sequential (FIFO) order for debug
- --export-on-exit={export directory(default same one as specified `--import` flag, or nothing)} (export data on shutdown like `emulators:export`)
- --import={dir path} Import data which saved by `--export-on-exit` or `emulators:export`

emulators:exec {scriptpath}	Run the script at scriptpath after starting emulators for the Firebase products configured in firebase.json. Above commands works with this.
- --ui Execution with Emulator UI

emulators:export {export_directory} Export/Import feature is for Authentication and 3 databases

--- 

```ts
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// firebaseApps previously initialized using initializeApp()
const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);
```

### Authentication
```ts
import { getAuth, connectAuthEmulator } from "firebase/auth";

const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");
```

- Test Auth with IdP
```ts
// Automate user clicks on the platform
firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential( // Any Providers ok
  '{"sub": "abc123", "email": "foo@example.com", "email_verified": true}' /* sub: primary key. Any string */
))
```

### Realtime Database
```ts
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

const db = getDatabase();
if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(db, "localhost", 9000);
} 

// Clear data
import { getDatabase, ref, set } from "firebase/database";

// With a database Reference, write null to clear the database.
const db = getDatabase();
set(ref(db), null);
```

### Firestore
```ts
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// firebaseApps previously initialized using initializeApp()
const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);
```
- Clear data
`HTTP DELETE "http://localhost:8080/emulator/v1/projects/firestore-emulator-example/databases/(default)/documents"`
// Shell alternative…
$ curl -v -X DELETE "http://localhost:8080/emulator/v1/projects/firestore-emulator-example/databases/(default)/documents"

### Cloud Storage
```ts
const { getStorage, connectStorageEmulator } = require("firebase/storage");

const storage = getStorage();
if (location.hostname === "localhost") {
  // Point to the Storage emulator running on localhost.
  connectStorageEmulator(storage, "localhost", 9199);
} 
```

### Cloud Function
```ts
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);
```
>Android 9 (API level 28): Unencrypted http is unallowed. Set up a network_security_config.xml file to whitelist the Cloud Functions emulator for development on localhost

HTTPS functions will be served from "http://$HOST:$PORT/$PROJECT/$REGION/$FUNCTION_NAME"

#### Admin SDK
`export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"` Admin SDKs automatically connect to the Authentication Emulator. (Through Cloud Function, it's not necessary.)

#### Limitation
- reCAPTCHA and APN flow: Disable them on test
- Test phone numbers with codes preconfigured in the Firebase console.

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
