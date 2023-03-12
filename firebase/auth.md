# Authentication
Authenticated -> (default) access to Realtime Database, Cloud Storage
-> A user becomes the current user of the Auth instance. | sign-out -> user data still accessable if instance keeps a reference to a user
One user can have multiple sign-in methods
- (already have authentication system) Custom Authentication
- (customizable UI) FirebaseUI Auth
- full control sign-in using Firebase Authentication SDK
- Anonymous Auth

User instance (unique to the project, independent from Firebase Authentication) [id, email, name, photo url] > project's user database | others > firestore, etc...
<< populated properties based on by initial sign-up method (email&password, each IdPs, customized auth system(properties controllable))

Auth listener (the user lifecycle)
- The Auth object initialized (with a user has signed-up(in)) WHEN: signed in from previous session, redirected from sign-in flow
- sign-in (the current user set)
- sign-out (the current user null)
- the current user's *access token* refreshed 
  - expires -> new *access token* provided by using *the refresh token*
  - the user changes password -> new *access*, *refresh* token generated. olds expires. and/or?? sign-out on other devices
  - the user re-authenticate when performs private actions(change password, delete account..), re-sign-in requires

Auth tokens
- Firebase ID tokens: created when sign-in, Signed JWTs,contains ^basic user profiles, send them to server to verify the current sign-in user 
- Identity provider tokens: created by IdP, mostly OAuth 2.0 access tokens, Apps verify IdP auth success -> Firebase usable credentials
- Firebase custom tokens: JWTs signed using a service account's private key, Used like ^tokens

Email
Account Auto link: same email with different IdPs -> same user / Throw error & user link action required
Trusted IdPs: Google, Microsoft, Yahoo,  Apple / Untrusted IdPs: Facebook, Twitter, GitHub, trusted IdPs for domains not issued by that IdPs themselves,  Email&Password without email verification
- same email sign-in *untrusted* x2: *linking* required
- same email sign-in *trusted* -> *untrusted*: *linking* required
- same email sign-in *untrusted* -> *trusted*: *auto linked*
- same email sign-in *trusted* x2: *auto linked*

Service Email from own domain (also for multi-tenant projects) (Email Custom Domains->save items)
Usage Limits (->saved items)

## Upgrade Firebase Authentication with Google Cloud Identity Platform
Console > Auth > Settings > code addition
enhanced logging, enterprise-grade support, SLAs, Multi-factor auth, blocking functions, support for SAML and OpenID Connect providers
pricing&limit: Introduction (->saved items)

## Web (TODO)
### Anonymous Auth
Console > Auth > Sign-in Methods > enable Anonymous > source code

### Link Multiple IdPs 
sign-in credentials to the anonymous account -> future session available 
- `linkWithPopup` or `linkWithRedirect`&(in redirect back to page)`getRedirectResult` >  `provider.credentialFromResult(result)`  
- link email&password credentials to a user account: `EmailAuthProvider.credential(email, password)` > `linkWithCredential(auth.currentUser, AuthCredentials)`
- anonymous account -> permanent account
-> When sign-up, complete IdP sign-in flow without `Auth.signInWith~` > Get *AuthCredential* `AuthCredential = ~~AuthProvider.credential(token or something)` > Pass *AuthCredential* to sign-in user's *link* method `linkWithCredential(auth.currentUser, AuthCredential).then((usercred)=>user=usercred.user).catch(...` > new account can access their anonymous account's data

Conflict (if credentials already linked to another user account)
```ts
import { getAuth, signInWithCredential, linkWithCredential, OAuthProvider } from "firebase/auth";

// The implementation of how you store your user data depends on your application
const repo = new MyUserDataRepo();

// Get reference to the currently signed-in user
const auth = getAuth();
const prevUser = auth.currentUser;

// Get the data which you will want to merge. This should be done now
// while the app is still signed in as this user.
const prevUserData = repo.get(prevUser);

// Delete the user's data now, we will restore it if the merge fails
repo.delete(prevUser);

// Sign in user with the account you want to link to
signInWithCredential(auth, newCredential).then((result) => {
  console.log("Sign In Success", result);
  const currentUser = result.user;
  const currentUserData = repo.get(currentUser);

  // Merge prevUser and currentUser data stored in Firebase.
  // Note: How you handle this is specific to your application
  const mergedData = repo.merge(prevUserData, currentUserData);

  const credential = OAuthProvider.credentialFromResult(result);
  return linkWithCredential(prevUser, credential)
    .then((linkResult) => {
      // Sign in with the newly linked credential
      const linkCredential = OAuthProvider.credentialFromResult(linkResult);
      return signInWithCredential(auth, linkCredential);
    })
    .then((signInResult) => {
      // Save the merged data to the new user
      repo.set(signInResult.user, mergedData);
    });
}).catch((error) => {
  // If there are errors we want to undo the data merge/deletion
  console.log("Sign In Error", error);
  repo.set(prevUser, prevUserData);
});
```

Auto clean-up after 30 days: *with Identity Platform* > Console > enable auto clean-up -> Free usage limits or billing quotas

Unlink: `unlink(auth.currentUser,  providerData.providerId)`

## Admin (TODO all pages)
authentication -> (service account credentials specific for project, not user) full access to the project resources
admin control user, disable end-user to perform account actions -> http response error: 'auth/admin-restricted-oeration'

- Customize Email Template: https://support.google.com/firebase/answer/7000714
