### Admin, GCP
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
