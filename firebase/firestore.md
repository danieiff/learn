- Add documents
```ts
import { collection, addDoc } from "firebase/firestore"; 
try {
  const docRef = await addDoc(collection(db, "users"), { first: "Ada", last: "Lovelace", born: 1815 })
  console.log("Document written with ID: ", docRef.id);
} catch (e) { console.error("Error adding document: ", e); }
```
- Read data
```ts
import { collection, getDocs } from "firebase/firestore"; 
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => { console.log(`${doc.id} => ${doc.data()}`) })
```
- Ref to document/collections
```ts
import { doc } from "firebase/firestore";
const alovelaceDocumentRef = doc(db, 'users', 'alovelace') //does not perform any network operations yet.
const alovelaceDocumentRef = doc(db, 'users/alovelace') // pattern 2 full path to doc

import { collection } from "firebase/firestore";
const usersCollectionRef = collection(db, 'users');
```
- Set
```ts
import { Timestamp } from 'firebase/firestore'
await setDoc(doc(db, "cities", "LA"), {
  name: "Los Angeles",
  state: "CA",
  country: "USA",
  dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
}, { merge: false /* overwrite by default */ }) 
```
- Add
```ts
const docRef = await addDoc(collection(db, "cities"), {
  name: "Tokyo",
  country: "Japan"
});
console.log("Document written with ID: ", docRef.id);

// equivalent pattern using `doc`
const newCityRef = doc(collection(db, "cities"));
// later...
await setDoc(newCityRef, data);
```
- Update
```ts
import { updateDoc, serverTimestamp } from "firebase/firestore";
const washingtonRef = doc(db, "cities", "DC");
await updateDoc(washingtonRef, {
  timestamp: serverTimestamp(), // useful on updating multiple fields in the transaction
  "favorites.color": "Red", // use "dot notation" to reference nested fields. can be partially update or merge a map field without overwrite
  regions: arrayUnion("greater_virginia"), // Atomically Add to array (`arrayUnion` to atomically remove)
  population: increment(50), // increment decrement (limit: once/sec) if not a numeric field, updated as given numeric value
})
```
- Delete
Deleting a doc does not delete its subcollections. Documents which ancestor doesn't exist can be refered only by Firebase Console, cannot by queries.
- Doc: `deleteDoc()`
- Field: `await updateDoc(cityRef, { capital: deleteField() })`
- Collection: from Web SDK is not recommended. from Node.js api -->
```ts
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
```
- From CLI: `firebase firestore:delete [options] <path>`


## TRANSACTION BATCH
```ts
service cloud.firestore {
  match /databases/{database}/documents {
    // If you update a city doc, you must also update the related country's last_updated field.
    match /cities/{city} {
      allow write: if request.auth != null &&
        getAfter( // Access and validate the state of a document after a set of operations completes but before Cloud Firestore commits the operations
          /databases/$(database)/documents/countries/$(request.resource.data.country)
        ).data.last_updated == request.time;
    }
    match /countries/{country} {
      allow write: if request.auth != null;
    }
  }
}
```
### Transaction
All success or fail
Read first then write (if modified before transaction write applied, then retried) (<= 10MiB)
Queries and reads inside a transaction do not see the results of previous writes inside that transaction so document reads must come before writes.
```ts
import { runTransaction } from "firebase/firestore";
try {
  await runTransaction(db, async (transaction) => {
    const sfDoc = await transaction.get(sfDocRef);
    if (!sfDoc.exists()) {
      throw "Document does not exist!";
    }
    const newPopulation = sfDoc.data().population + 1;
    transaction.update(sfDocRef, { population: newPopulation });
    // instead modify application's state inside transaction, pass it like return newPopulation // for reject, like return Promise.reject("Sorry! Population is too big");
  });
  console.log("Transaction successfully committed!");
} catch (e) { console.log("Transaction failed: ", e); }
```
### Batch
From web (optimistic) or admin(or server client library) (locks database) sdk (<= 500 operations)
```ts
import { writeBatch, doc } from "firebase/firestore"
const batch = writeBatch(db) // Get a new write batch
const nycRef = doc(db, "cities", "NYC") // Set the value of 'NYC'
batch.set(nycRef, {name: "New York City"});

const sfRef = doc(db, "cities", "SF")
batch.update(sfRef, {"population": 1000000}) // Update the population of 'SF'

const laRef = doc(db, "cities", "LA")
batch.delete(laRef) // Delete the city 'LA'

await batch.commit() // Commit the batch
```


## Traffic
Starting with a maximum of 500 operations per second to a new collection and then increasing traffic by 50% every 5 minutes. Be care when migrating collections
- Avoid skipping over deleted data (because also needs to skip all related indexes)
```ts
completed_items = db.collection('CompletionStats').document('all stats').get()
docs = db.collection('WorkItems').start_at(
    {'created': completed_items.get('last_completed')}).order_by(
        'created').limit(100)
delete_batch = db.batch()
last_completed = None
for doc in docs.stream():
  finish_work(doc)
  delete_batch.delete(doc.reference)
  last_completed = doc.get('created')

if last_completed:
  delete_batch.update(completed_items.reference,
                      {'last_completed': last_completed})
  delete_batch.commit()
```
## DATA TYPES (SORT ORDER)
Sort Order with mixed-types
1. Null values
2. Boolean values (false < true)
3. Integer (64-bit signed) and floating-point (64-bit double precision, IEEE 754.) values, sorted in numerical order
4. Date values (Chronological, rounded down below microsecs)
5. Text string values (UTF-8 encoded byte order, Up to 1MB)
6. Byte values (Byte order, Up to 1,048,487 bytes (1 MiB - 89 bytes). Only the first 1,500 bytes are accounted by queries.)
7. Cloud Firestore references
8. Geographical point values (By latitude, then longitude,  better to store latitude and longitude as separate numeric fields with Geo queries)
9. Array (cannot nest, sorted by each element. [1, 2, 3] (shorter) < [1, 2, 3, 1] < (largest "2" among first elements) [2])
10. Map values (By keys, then by value then map length. Also before when saved, sorted in this order)
(When indexed, you can query on subfields. If you exclude this value from indexing, then all subfields are also excluded from indexing.)

- Reference (By path elements) --out-of-order


## Index
Queries which requires the index but not set up will fail in error, and asked for setting up.
- Single-field indexes with collection-scope (by default)
  - For each non-array and non-map field, collection-scope single-field indexes, ascending and descending for each.
  - For each map field, collection-scope ascending and descending for each non-array and non-map subfield in the map.
  - For each array field in a document, a collection-scope array-contains index.
- Composite indexes (that enables compound queries)

- index modes (Ascending, Descending, Array-contains)
- index scopes (collection-scope, collection-group-scope)

- `__name__` field is set full path for the document by default, collection-scope, sorted in the same direction of the last sorted field in the index definition
### LIMIT
- composite indexes for a database: 200 (can request to increase to firebase/support)
- fields in a composite index: 100
- single-field configurations: 200 (a single-field indexing exemption and a TTL policy on the same field count as one)
- index entries: 40,000 (single-field index entries + composite ones)
- one index size: 7.5KiB
- sum of indexes in a databse: 8MiB
- an indexed field value: 1500 bytes (more are truncated)
### BEST PRACTICE
- Exempt the large string fields from indexing
- High write rates to a collection containing documents with sequential values like a timestamp with IoT project: Exempting the field from indexing can bypass the write rate limit 500 writes/sec
- Exempt TTL fields (time-to-live policies)
- Exempt large array or map fields unless querying with it


## Admin
Secured with IAM
Security rules are not applied for requests from the server client. 
- initialize admin sdk
```ts
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
initializeApp(/* if on Google Cloud, { credential: applicationDefault() } */)
// if on your own server, const serviceAccount = require('./path/to/serviceAccountKeyInGCConsole.json') and pass it as a credential property.
const db = getFirestore();
```
### Data Bundles
For cache. As binary file.
- Build bundles on the server
```ts
var bundleId = "latest-stories";
var bundle = firestore.bundle(bundleId);
var docSnapshot = await firestore.doc('stories/stories').get();
var querySnapshot = await firestore.collection('stories').get();

// Build the bundle
// Note how querySnapshot is named "latest-stories-query"
var bundleBuffer = bundle.add(docSnapshot); // Add a document
                   .add('latest-stories-query', querySnapshot) // Add a named query.
                   .build()
// Then save this as like 'bundle.txt' file
```
- Serve bundles 
CDN, Cloud Storage, etc
```ts
const fs = require('fs');
const server = require('http').createServer();
server.on('request', (req, res) => {
  const src = fs.createReadStream('./bundle.txt');
  src.pipe(res);
});
server.listen(8000);
```
- Load bundles
```ts
// If you are using module bundlers.
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firestore/bundle"; // This line enables bundle loading as a side effect.

// ...

async function fetchFromBundle() {
  // Fetch the bundle from Firebase Hosting, if the CDN cache is hit the 'X-Cache'
  // response header will be set to 'HIT'
  const resp = await fetch('/createBundle');

  // Load the bundle contents into the Firestore SDK
  await db.loadBundle(resp.body);

  // Query the results from the cache
  // Note: omitting "source: cache" will query the Firestore backend.
  const query = await db.namedQuery('latest-stories-query');
  const storiesSnap = await query.get({ source: 'cache' });

  // Use the results
  // ...
}
```


## Firestore Lite
- single document fetches, query execution, and document updates
`import { getFirestore, getDoc, updateDoc } from 'firebase/firestore/lite'`
- Not supported
  - DocumentSnapshot event handlers. The onSnapshot method and DocumentChange, SnapshotListenerOptions, SnapshotMetadata, SnapshotOptions and Unsubscribe objects are not included.
  - Persistence helpers. The enableIndexedDBPersistence, enableMultiTabIndexedDbPersistence, and clearIndexedDbPersistence methods are not included.
  - Firestore bundles. The loadBundle method and related methods, and the LoadBundleTask and LoadBundleTaskProgress objects are not included.
- Add documents
