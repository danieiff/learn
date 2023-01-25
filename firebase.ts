// Firebase Cli
// npm i -g firebase-tools
// firebase login:ci
// export FIREBASE_TOKEN={token} // firebase --token {token} [--config {path}] {command} // firebase logout --token {token}
// firebase init // products config added to firebase.json , (project aliases in .firebaserc // firebase use --add) , other config files
// firebase.json -> assets to deploy, pre-post deploy hooks  NB: take care deployment conflicts(console vs cli)  

// firebase use {options} // ({any firebase command} --project {project}) (other way than (firebase use --add (without assigning an alias) ) is more suitable for personal project 

// firebase serve --only hosting,functions // for test only hosting and functions in local // NB: config needs for access from other device on same network

// continue in https://firebase.google.com/docs/cli#deployment

// Hosting


// # Authentication
// Authenticated -> (default) access to Realtime Database, Cloud Storage
// -> A user becomes the current user of the Auth instance. | sign-out -> user data still accessable if instance keeps a reference to a user
// One user can have multiple sign-in methods
// - (already have authentication system) Custom Authentication
// - (customizable UI) FirebaseUI Auth
// - full control sign-in using Firebase Authentication SDK
// - Anonymous Auth
//
// User instance (unique to the project, independent from Firebase Authentication) [id, email, name, photo url] > project's user database | others > firestore, etc...
// << populated properties based on by initial sign-up method (email&password, each IdPs, customized auth system(properties controllable))
//
// Auth listener (the user lifecycle)
// - The Auth object initialized (with a user has signed-up(in)) WHEN: signed in from previous session, redirected from sign-in flow
// - sign-in (the current user set)
// - sign-out (the current user null)
// - the current user's *access token* refreshed 
//   - expires -> new *access token* provided by using *the refresh token*
//   - the user changes password -> new *access*, *refresh* token generated. olds expires. and/or?? sign-out on other devices
//   - the user re-authenticate when performs private actions(change password, delete account..), re-sign-in requires
//
// Auth tokens
// - Firebase ID tokens: created when sign-in, Signed JWTs,contains ^basic user profiles, send them to server to verify the current sign-in user 
// - Identity provider tokens: created by IdP, mostly OAuth 2.0 access tokens, Apps verify IdP auth success -> Firebase usable credentials
// - Firebase custom tokens: JWTs signed using a service account's private key, Used like ^tokens
//
// Email
// Account Auto link: same email with different IdPs -> same user / Throw error & user link action required
// Trusted IdPs: Google, Microsoft, Yahoo,  Apple / Untrusted IdPs: Facebook, Twitter, GitHub, trusted IdPs for domains not issued by that IdPs themselves,  Email&Password without email verification
// - same email sign-in *untrusted* x2: *linking* required
// - same email sign-in *trusted* -> *untrusted*: *linking* required
// - same email sign-in *untrusted* -> *trusted*: *auto linked*
// - same email sign-in *trusted* x2: *auto linked*
//
// Service Email from own domain (also for multi-tenant projects) (Email Custom Domains->save items)
// Usage Limits (->saved items)
// 
// Upgrade to Google Cloud Identity Platform (TODO)
//
// ## Web (TODO)
// ### Anonymous Auth
// anonymous account -> link sign-in credentials to the anonymous account -> future session available
// Console > Auth > Sign-in Methods > enable Anonymous > source code
//
// ## Admin (TODO all pages)
// authentication -> (service account credentials specific for project, not user) full access to the project resources
// admin control user, disable end-user to perform account actions -> http response error: 'auth/admin-restricted-oeration'

// # Groceries
// IdP: Identity Provider
