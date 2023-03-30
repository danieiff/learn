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

## Admin
Secured with IAM
Security rules are not applied for requests from the server client. 

## Firestore Lite
- single document fetches, query execution, and document updates
`import { getFirestore, getDoc, updateDoc } from 'firebase/firestore/lite'`
- Not supported
  - DocumentSnapshot event handlers. The onSnapshot method and DocumentChange, SnapshotListenerOptions, SnapshotMetadata, SnapshotOptions and Unsubscribe objects are not included.
  - Persistence helpers. The enableIndexedDBPersistence, enableMultiTabIndexedDbPersistence, and clearIndexedDbPersistence methods are not included.
  - Firestore bundles. The loadBundle method and related methods, and the LoadBundleTask and LoadBundleTaskProgress objects are not included.
