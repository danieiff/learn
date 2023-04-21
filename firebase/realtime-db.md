DATABASE_NAME.firebaseio.com (for databases in us-central1)

DATABASE_NAME.REGION.firebasedatabase.app (for databases in all other locations)

 const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://DATABASE_NAME.firebaseio.com",
};

## API
- set()
- push()
```
const postListRef = ref(db, 'posts');
const newPostRef = push(postListRef);
set(newPostRef, { /* ... */ });
```
- onValue (!!! all data at the location) ( pass { onlyOnce: true } to get once)
- onChild(Changed|Added|Removed|Moved) (!!! passed a snapshot of (changed) data )
- get() (once)
- val(), exists()
- update()
```ts
 // A post entry.
  const postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  const newPostKey = push(child(ref(db), 'posts')).key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  update(ref(db), updates);
```
- remove()
- off() (Ref method. Detach listner on the exact path, not for descendants)

### TRANSACTION
- runTransaction()
```ts
const postRef = ref(db, '/posts/foo-bar-123');

runTransaction(postRef, (post) => {
if (post) {
  if (post.stars && post.stars[uid]) {
    post.starCount--;
    post.stars[uid] = null;
  } else {
    post.starCount++;
    if (!post.stars) {
      post.stars = {};
    }
    post.stars[uid] = true;
  }
}
return post;
});
```
- Atomic server operation
```ts
function addStar(uid, key) {
  import { getDatabase, increment, ref, update } from "firebase/database";
  const dbRef = ref(getDatabase());

  const updates = {};
  updates[`posts/${key}/stars/${uid}`] = true;
  updates[`posts/${key}/starCount`] = increment(1);
  updates[`user-posts/${key}/stars/${uid}`] = true;
  updates[`user-posts/${key}/starCount`] = increment(1);
  update(dbRef, updates);
}
```

### SORT/FILTER
- orderByChild() Order results by the value of a specified child key or nested child path.
1. Children with a null value for the specified child key come first.
2. Children with a value of false for the specified child key come next. If multiple children have a value of false, they are sorted lexicographically by key.
3. Children with a value of true for the specified child key come next. If multiple children have a value of true, they are sorted lexicographically by key.
4. Children with a numeric value come next, sorted in ascending order. If multiple children have the same numerical value for the specified child node, they are sorted by key.
5. Strings come after numbers and are sorted lexicographically in ascending order. If multiple children have the same value for the specified child node, they are ordered lexicographically by key.
6. Objects come last and are sorted lexicographically by key in ascending order.
- orderByKey() Order results by child keys. 1. number (in ascending order), 2. string (lexicographically in ascending order)
- orderByValue() Order results by child values. Sort with values by `orderByChild` criteria
```ts
const myUserId = auth.currentUser.uid;
const topUserPostsRef = query(ref(db, 'user-posts/' + myUserId), orderByChild('starCount'))
```
- limitToFirst() Sets the maximum number of items to return from the beginning of the ordered list of results.
set a limit of 100, you initially only receive up to 100 child_added events
If you have fewer than 100 items stored in your Firebase database, a child_added event fires for each item.
- limitToLast()
a query to retrieve a list of the 100 most recent posts by all users:
`const recentPostsRef = query(ref(db, 'posts'), limitToLast(100));`
- startAt()
- startAfter()
- endAt()
- endBefore()
- equalTo()

## SECUTIRY RULE
### query rule
```
"baskets": {
  ".read": "auth.uid !== null &&
            query.orderByChild === 'owner' &&
            query.equalTo === auth.uid" // restrict basket access to owner of basket
}
```
```
db.ref("baskets").orderByChild("owner")
                 .equalTo(auth.currentUser.uid)
                 .on("value", cb)                 // Would succeed
```
- limit how much data a client downloads through read operations.
```
messages: {
  ".read": "query.orderByKey &&
            query.limitToFirst <= 1000"
}

// Example queries:

db.ref("messages").on("value", cb)                // Would fail with PermissionDenied

db.ref("messages").limitToFirst(1000)
                  .on("value", cb)                // Would succeed (default order by key)
```

## OFFLINE DATA
All writes to the database trigger local events immediately, before any data is written to the server.
For web sdk, data offline outside of the session doesn't persist

- /.info/connected (this path preserved for presence data)
```ts
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => { if (snap.val() === true) console.log("connected") else console.log("not connected") }
});
```
- onDisconnect()
```ts
const presenceRef = ref(db, "disconnectmessage");
// Write a string when this client loses connection
onDisconnect(presenceRef).set("I disconnected!");
```

```
const myConnectionsRef = ref(db, 'users/joe/connections');

// stores the timestamp of my last disconnect (the last time I was seen online)
const lastOnlineRef = ref(db, 'users/joe/lastOnline');

const connectedRef = ref(db, '.info/connected');
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
    const con = push(myConnectionsRef);

    // When I disconnect, remove this device
    onDisconnect(con).remove();

    // Add this device to my connections list
    // this value could contain info about the device or a timestamp too
    set(con, true);

    // When I disconnect, update the last time I was seen online
    onDisconnect(lastOnlineRef).set(serverTimestamp());
  }
});
```

- TIME
  - Usual
```ts
const userLastOnlineRef = ref(db, "users/joe/lastOnline");
onDisconnect(userLastOnlineRef).set(serverTimestamp());
```
  - useful to estimate the client's clock skew `.info/serverTimeOffset`
```
const offsetRef = ref(db, ".info/serverTimeOffset");
onValue(offsetRef, (snap) => {
  const offset = snap.val();
  const estimatedServerTimeMs = new Date().getTime() + offset;
});
```

## Configure multiple database instances
### security rule
- From Firebase Console
- From CLI
1. Modify the rules in the rules files for your database instances (for example, foo.rules.json).
Create and apply deploy targets to associate databases that use the same rules file. For example:
```
firebase target:apply database main my-db-1 my-db-2
firebase target:apply database other my-other-db-3
```

2. Update your firebase.json configuration file with the deploy targets:
```
{ "database": [
    {"target": "main", "rules": "foo.rules.json"},
    {"target": "other", "rules": "bar.rules.json"}
  ] }
```
3. Run the deploy command: `firebase deploy`

## OPTIMIZE, PROFILE
- Firebase Console
- `firebase database:profile`
events or properties defined for this purpose.

## BACKUP
### Store
- > Firebase Console
- Scheduled
- Stored in Cloud Storage (WRITER permission)
  - Standald cost
  - Filename `YYYY-MM-DDTHH:MM:SSZ_<DATABASE_NAME>_(data|rules).json(.gz)`
- Gzip compression
  - `gunzip <DATABASE_NAME>.json.gz  # Will unzip to <DATABASE_NAME>.json`
- 30-day lifecycle
### Restore
- > Firebase Console
- > `curl 'https://<DATABASE_NAME>.firebaseio.com/.json?auth=<SECRET>&print=silent' -x PUT -d @<DATABASE_NAME>.json`

## Cloud Function
### v1
- `functions.database.instance('my-app-db-2').ref('/foo/bar') //.instance(...) can be omit for default`
path '/foo/bar' including descendants

- '/foo/{bar}(/<0 or more paths>)' -> `context.params.bar`(EventContext.params)
Matches multiple events from a single write
An insert of `{ "foo": { "hello": "world", "firebase": "functions" } }`
matches the path "/foo/{bar}" twice: once with "hello": "world" and again with "firebase": "functions".

`onWrite`, `onUpdate`: first parameter is a `Change` object that contains two snapshots, before and after the triggering event. 
`onCreate`, `onDelete`: the data object returned is a snapshot of the data created or deleted.

```ts
// Listens /messages/:pushId/original and creates an uppercase to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
     
      const original = snapshot.val();
      functions.logger.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();

      // You must return a Promise when performing asynchronous tasks inside a Functions such as writing to the Firebase Realtime Database.
      return snapshot.ref.parent.child('uppercase').set(uppercase) //Can be chain .then(()=>{}).catch(()=>{})
    });
```

- impersonate pattern
```ts
exports.impersonateMakeUpperCase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snap, context) => {
      const appOptions = JSON.parse(process.env.FIREBASE_CONFIG);
      appOptions.databaseAuthVariableOverride = context.auth;
      const app = admin.initializeApp(appOptions, 'app');
      const uppercase = snap.val().toUpperCase();
      const ref = snap.ref.parent.child('uppercase');

      const deleteApp = () => app.delete().catch(() => null);

      return app.database().ref(ref).set(uppercase).then(res => {
        // Deleting the app is necessary for preventing concurrency leaks
        return deleteApp().then(() => res);
      }).catch(err => {
        return deleteApp().then(() => Promise.reject(err));
      });
    });
```
