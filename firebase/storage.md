## API
```
const firebaseConfig = { /*...*/ storageBucket: '' }
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

// const storage = getStorage(firebaseApp, "gs://my-custom-bucket")`// Custom storage buckets

import { getStorage, ref } from "firebase/storage";
const storageRef = ref(storage /* 'images' slash separated path */ )
const rootRef = storageRef.root
const parentRsf = storageRef.parent

const earthRef = ref(parentRef.parent, 'earth.jpg') // chain multiple times
const nullRef = spaceRef.root.parent // nullRef is null, since the parent of root is null

// properties of ref: fullPath (~1024bytes utf-8), name (Don't use '# [ ] * ?'), bucket

```
### Upload
```ts
// File, Blob, Uint8Array (like const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);)
// import { uploadBytes } from 'firebase/storage'
// const storageRef = ref(storage, 'destination full path')
/** @type {any} */
const metadata = { contentType: 'image/jpeg' /*, name, size, */ } // application/octet-stream is added if no ext

uploadBytes(storageRef, file /*, metadata */ )
.then((snapshot) => console.log('Uploaded a blob or file!'))

// String
// import { uploadString } from 'firebase/storage'
// Raw string is the default if no format is provided
const message = 'This is my message.'
const messageBase64 = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB'
const messageBase64url = '5b6p5Y-344GX44G-44GX44Gf77yB44GK44KB44Gn44Go44GG77yB'
const message4DataUrl = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB'
uploadString(storageRef, message /*, 'base64','base64url','data_url' */ )


const uploadTask = uploadBytesResumable(storageRef, file)
uploadTask.pause()
uploadTask.resume()
uploadTask.cancel() // return error indicating cancelled

uploadTask.on('state_changed', 
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => { // error }, 
  () => {
    // Success
    // Get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
)

```

### Download
```ts
const pathReference = ref(storage, 'images/stars.jpg')
const gsReference = ref(storage, 'gs://bucket/images/stars.jpg')
const httpsReference = ref(storage, 'https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg') // URL escaped

getDownloadURL(ref(storage, 'images/stars.jpg'))
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();

    // Or inserted into an <img> element
    const img = document.getElementById('myimg');
    img.setAttribute('src', url);
  })
  .catch((error) => { 
    //  https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  })

getBlob() // browser-like environment only
getBytes() 
getStream() // Node.js
```

### CORS
```cors.json:
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```
`gsutil cors set cors.json gs://<your-cloud-storage-bucket>` to deploy these restrictions

### Metadata
```ts
getMetadata(storageRef)
  .then((metadata) => {
    // Metadata now contains the metadata for 'images/forest.jpg'
  })
  .catch((error) => { // 

const newMetadata = {
  cacheControl: 'public,max-age=300',
  contentType: null // deletes
};

updateMetadata(storageRef, newMetadata)
  .then((metadata) => {
    // Updated metadata for 'images/forest.jpg' is returned in the Promise
  }).catch((error) => { // 

```
Property	Type	Writable
bucket	string	NO
generation	string	NO
metageneration	string	NO
fullPath	string	NO
name	string	NO
size	number	NO
timeCreated	string	NO
updated	string	NO
md5Hash	string	YES on upload, NO on updateMetadata
cacheControl	string	YES
contentDisposition	string	YES
contentEncoding	string	YES
contentLanguage	string	YES
contentType	string	YES
customMetadata	Object containing string->string mappings	YES

### Delete `deleteObject(storageRef).then(() => { // success }).catch((error) => { //`

### List
List API returns prefixes and items separately. 
- Example: /images/uid/file1
  - root.child('images').listAll() will return /images/uid as a prefix.
  - root.child('images/uid').listAll() will return the file as an item.

List operation on `Prefix1,2` in the following structure will return nothing.
Prefix1//Item (`//`), Prefix2/ (Ends with `/`)
```ts
// import { listAll } from "firebase/storage"
const listRef = ref(storage, 'files/uid')
// Find all the prefixes and items.
listAll(listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => { // All the prefixes under listRef. You may call `listAll()` recursively on them. })
    res.items.forEach((itemRef) => { // All the items under listRef. })
  }).catch((error) => { //


// Pagination with `list`
// import { list } from "firebase/storage"
async function pageTokenExample() {
  const storage = getStorage()
  const listRef = ref(storage, 'files/uid')

  const firstPage = await list(listRef, { maxResults: 100 }) // first 100 items

  // Use the result.
  // processItems(firstPage.items)
  // processPrefixes(firstPage.prefixes)

  // Fetch the second page if there are more elements.
  if (firstPage.nextPageToken) {
    const secondPage = await list(listRef, {
      maxResults: 100,
      pageToken: firstPage.nextPageToken,
    });
    // processItems(secondPage.items)
    // processPrefixes(secondPage.prefixes)
  }
}
```

### Error
storage/unknown	An unknown error occurred.
storage/object-not-found	No object exists at the desired reference.
storage/bucket-not-found	No bucket is configured for Cloud Storage
storage/project-not-found	No project is configured for Cloud Storage
storage/quota-exceeded	Quota on your Cloud Storage bucket has been exceeded. If you're on the no-cost tier, upgrade to a paid plan. If you're on a paid plan, reach out to Firebase support.
storage/unauthenticated	User is unauthenticated, please authenticate and try again.
storage/unauthorized	User is not authorized to perform the desired action, check your security rules to ensure they are correct.
storage/retry-limit-exceeded	The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.
storage/invalid-checksum	File on the client does not match the checksum of the file received by the server. Try uploading again.
storage/canceled	User canceled the operation.
storage/invalid-event-name	Invalid event name provided. Must be one of [`running`, `progress`, `pause`]
storage/invalid-url	Invalid URL provided to refFromURL(). Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>
storage/invalid-argument	The argument passed to put() must be `File`, `Blob`, or `UInt8` Array. The argument passed to putString() must be a raw, `Base64`, or `Base64URL` string.
storage/no-default-bucket	No bucket has been set in your config's storageBucket property.
storage/cannot-slice-blob	Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.
storage/server-file-wrong-size	File on the client does not match the size of the file recieved by the server. Try uploading again.


## Security rule
In v2, recursive wildcards match zero or more path items. Thus, /images/{filenamePrefixWildcard}/{imageFilename=**} matches filenames /images/profilePics/profile.png and /images/badge.png.
```
rules_version = '2'; //necessary
service firebase.storage {
  // define function within this scope
  function isCurrentUser(uid) {
    return request.auth.uid == uid;
  }
  function lessThanNMegabytes(n) {
    return request.resource.size < n * 1024 * 1024
  }
  function isImage() {
    return request.resource.contentType.matches('image/.*');
  }
  function signedInOrPublic() {
    return request.auth.uid != null || resource.data.visibility == 'public';
  }

  match /b/{bucket}/o {
    // match /{allPaths=**} {
    //   allow read, write: if request.auth != null;
    // }
    match /images/{imageId} {
      allow write: if request.auth != null && lessThanNMegabytes(5) && isImage();
      allow read: if true
    }
    match /users/{userId}/profilePicture.png {
      allow read;
      allow write: if isCurrentUser(userId);
    }
    match /files/{groupId}/{fileName} { // Prepare 'auth custom token', 'file metadata'
      allow read: if resource.metadata.owner == request.auth.token.groupId;
      allow write: if request.auth.token.groupId == groupId;
    } // Group private

    // create, update, delete, read, list
  }
}
```

- `request` obj
  - auth | When a user is logged in, provides uid, the user's unique ID, and token, a map of Firebase Authentication JWT claims. Otherwise, it will be null.
  - params | Map containing the query parameters of the request.
  - path | A path representing the path the request is being performed at.
  - resource | map<string, string> | The new resource value, present only on write requests.
  - time | server timestamp the request is evaluated at.
  - resource | metadata of file to be writtern in write request, same as below

- `resource` obj (metadata of file at the requested path or `request.resource`)
  - name, bucket, generation, metageneration, size
  - timeCreated (timestamp at created), updated (timestamp at updated)
  - md5Hash, crc32c (content hash)
  - etag, contentDisposition, contentEncoding, contentLanguage, contentType
  - metadata | Key/value pairs of additional, developer specified custom metadata.

- Reference Firestore
```
function isAdmin(userId) {
  return exists(/databases/$(database)/documents/admins/$(userId));
}
match /users/{club}/files/{fileId} {
    allow read: if club in
      firestore.get(/databases/(default)/documents/users/$(request.auth.id)).memberships
}
match /users/{userId}/photos/{fileId} {
    allow read: if
      firestore.exists(/databases/(default)/documents/users/$(userId)/friends/$(request.auth.id))
}
```
Prompted to require the integration in Console.
To disable, update rules and delete "Firebase Rules Firestore Service Agent" role from GC IAM page

- function
  - contains only single `return`
  - cannot loop or call external services
  - call stack upto 10
  - `let` to declare variable


## Admin, GCP
```ts
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('./path/to/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: '<BUCKET_NAME>.appspot.com' // "gs://  <<BUCKET-NAME>>  .appspot.com" in Firebase console
});

const bucket = getStorage(/*(firebase app instance (optional default))*/).bucket(/*(backet name (optional default))*/);

// 'bucket' is an object defined in the @google-cloud/storage library.
// See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
// for more details.
```
