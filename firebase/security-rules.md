### test (and dev)
firebase emulators:start --only firestore(storage, database)

#### @firebase/rules-unit-testing
```ts
let testEnv = await initializeTestEnvironment({ // params: optional
  projectId: "demo-project-1234",
  firestore: {
    rules: fs.readFileSync("firestore.rules", "utf8"),
  },
});
```
```ts
import { setDoc } from "firebase/firestore"; // Assuming a Firestore app and the Firestore emulator for this example

const alice = testEnv.authenticatedContext("alice", { /* (optional) custom claims or overrides for Authentication token payloads */ });
await assertSucceeds(setDoc(alice.firestore(), '/users/alice'), { ... });
```
```ts
import { getStorage, ref, deleteObject } from "firebase/storage"; // Assuming a Cloud Storage app and the Storage emulator for this example

const alice = testEnv.unauthenticatedContext();
const desertRef = ref(alice.storage(), 'images/desert.jpg');
await assertSucceeds(deleteObject(desertRef));
```
`RulesTestEnvironment.withSecurityRulesDisabled()`
Run a test setup function with a context that behaves as if Security Rules were disabled.
This method takes a callback function, which takes the Security-Rules-bypassing context and returns a promise. The context will be destroyed once the promise resolves / rejects.

`RulesTestEnvironment.cleanup()`
This method destroys all RulesTestContexts and the underlying resources, allowing a clean exit.
For test case clean up, run this and emulator-specifc clean data methods

---
Emulator-specific methods
- Firestore 
`RulesTestEnvironment.clearFirestore() => Promise<void>`
Clears data in the Firestore emulator 

`RulesTestContext.firestore(settings?: Firestore.FirestoreSettings) => Firestore;`
Gets a Firestore instance for this test context. Available for client SDK APIs of Firestore

- Realtime Database
`RulesTestEnvironment.clearDatabase() => Promise<void>`
Clears data

`RulesTestContext.database(databaseURL?: Firestore.FirestoreSettings) => Firestore;`
Get a Realtime Database instance 
URL: URL of the Realtime Database instance. If specified, returns an instance for an emulated version of the namespace with parameters extracted from URL.

- Storage
`RulesTestEnvironment.clearStorage() => Promise<void>`

`RulesTestContext.storage(bucketUrl?: string) => Firebase Storage;`
URL: "gs://" url to the Firebase Storage Bucket

#### Report
  - browser ui
  (firestore) http://localhost:8080/emulator/v1/projects/<database_name>:ruleCoverage.html 
  (realtime database) http://localhost:9000/.inspect/coverage?ns=<database_name>
  - Json
  (firestore) http://localhost:8080/emulator/v1/projects/<database_name>:ruleCoverage
  (realtime database) http://localhost:9000/.inspect/coverage.json?ns=<database_name>

- Interact with realtime database instance: http://localhost:9000/path/to/my/data.json?ns=<database_name> (default port 9000) (ref. production: https://<database_name>.firebaseio.com/path/to/my/data.json)

#### rules and auth
- request.auth.token.<field, (custom claims)>
- [Firestore]
```ts
service cloud.firestore {
  match /databases/{database}/documents/some_collection: {
    // Remember that, in Cloud Firestore, reads embedded in your rules are billed operations
    write: if request.auth != null && get(/databases/(database)/documents/users/$(request.auth.uid)).data.admin) == true;
    read: if request.auth != null;
  }
}
```

### deploy
firebase deploy --only firestore:rules (firestore, storage, database (without ":rules", rules are included in whole deployment process.))

### Admin SDK
#### deploy
- Firestore, Cloud Storage
```ts
 const source = `service cloud.firestore {
      match /databases/{database}/documents {
        match /carts/{cartID} {
          allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerUID;
          allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.ownerUID;
        }
      }
    }`;
    // Alternatively, load rules from a file
    // const fs = require('fs');
    // const source = fs.readFileSync('path/to/firestore.rules', 'utf8');

    await admin.securityRules().releaseFirestoreRulesetFromSource(source);
```
Alternative:
```ts
const rf = admin.securityRules().createRulesFileFromSource('firestore.rules', source);
const rs = await admin.securityRules().createRuleset(rf);
await admin.securityRules().releaseFirestoreRuleset(rs);
```

- Realtime Database
```ts
const source = `{
  "rules": {
    "scores": {
      ".indexOn": "score",
      "$uid": {
        ".read": "$uid == auth.uid",
        ".write": "$uid == auth.uid"
      }
    }
  }
}`;
await admin.database().setRules(source); //"getRules" method also exists
```

- list rulesets
```ts
const allRulesets = [];
let pageToken = null;
while (true) {
  const result = await admin.securityRules().listRulesetMetadata(pageToken: pageToken);
  allRulesets.push(...result.rulesets);
  pageToken = result.nextPageToken;
  if (!pageToken) {
    break;
  }
}
```

- delete all rulesets deployed for longer than 30 days:
```
const thirtyDays = new Date(Date.now() - THIRTY_DAYS_IN_MILLIS);
const promises = [];
allRulesets.forEach((rs) => {
  if (new Date(rs.createTime) < thirtyDays) {
    promises.push(admin.securityRules().deleteRuleset(rs.name));
  }
});
await Promise.all(promises);
console.log(`Deleted ${promises.length} rulesets.`);
```

### REST API
- create ruleset
```sh
curl -X POST -d '{
  "source": {
    {
      "files": [
        {
          "content": "' $(cat storage.rules) '",
          "name": "storage.rules",
          "fingerprint": <sha fingerprint>
        }
      ]
    }
  }
}' 'https://firebaserules.googleapis.com/v1/projects/secure_commerce/rulesets'
```

- deploy
```sh
curl -X POST -d '{
  "name": "projects/secure_commerce/releases/prod/v23   "  ,
  "rulesetName": "projects/secure_commerce/rulesets/uuid123",
}' 'https://firebaserules.googleapis.com/v1/projects/secure_commerce/releases'
```
