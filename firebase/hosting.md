## CI
- Preview and share
`firebase hosting:channel:deploy CHANNEL_ID` launches or updates preview channel, returning URL
- Deploy
  - `firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live` preview-ch to live-ch (Site id can be a site in the different project)
  - `firebase deploy --only hosting (-m "<COMMENT>")`


## Multiple sites
=< 36 sites
- Create/delete site
`firebase hosting:sites:create SITE_ID` or Console, REST API: `projects.sites.create`
`firebase hosting:sites:delete SITE_ID` ...

- Create a deploy target and apply a TARGET_NAME(define by yourself) to a site
  - `firebase target:apply hosting TARGET_NAME SITE_ID` modifies .firebaserc

```
{
  "projects": {
    "dev":"dev-pj",
    "prd":"prd-pj"
  },
  "targets": {
    "dev-pj": {
      "hosting": {
        "hoge": [ "hosting-site-nameA" ],
        "fuga": [ "hosting-site-nameB" ]
      }
    },
    "prd-pj": {
      "hosting": {
        "hoge": [ "hosting-site-nameA" ],
        "fuga": [ "hosting-site-nameB" ]
      }
    }
  }
}

{
  "hosting": [
    {
      "target": "hoge (TARGET_NAME)",
      "public": "packages/client/out",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
    },
    {
      "target": "fuga (TARGET_NAME)",
      "public": "packages/admin/out",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      // ...
      "rewrites": [...]  // You can define specific Hosting configurations for each site
    }
  ]
}
```

`firebase emulators:start --only hosting(:TARGET_NAME)` default or specified target
`firebase hosting:channel:deploy CHANNEL_ID (--only TARGET_NAME)` default or specified target
`firebase deploy --only hosting(:TARGET_NAME)` all sites in firebase.json or specified target

## Manage live,preview channel
- Limit the number of releases to keep (live, preview) -> Console
- Set the expiration of a preview channel
  -> Console, `firebase hosting:channel:deploy new-awesome-feature --expires 7d`
  (set channel expiry)->(new daploy)->(expiry count restart)
- Clone across (channel, FB Project)`firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID(@VERSION_ID) TARGET_SITE_ID:TARGET_CHANNEL_ID`)
  - For your default Hosting site id, use your Firebase project ID.
  - For a live channel, use live as the channel ID
  - Version id will be different between different projects. Same within a project
- Roll back (live channel) -> Console
- Delete (live ch -> Console) (preview ch -> Console, `firebase hosting:channel:delete CHANNEL_ID`)

### preview ch
- `firebase hosting:channel:create CHANNEL_ID` create/delete/deploy/list/open
  - create new channel in the default Hosting site
  - delete
  - deploy (if ch doesn't exist, create&deploy new channel in the default Hosting site)
  - list channels in the default Hosting site
  - open preview URL

## GitHub Actions 
`firebase init hosting:github`
- w9jds/firebase-action
name: Deploy to Firebase
  uses: w9jds/firebase-action@master
  with:
      args: deploy --project=dev --force
      env: FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN_DEV (from `firebase login:ci`) }}

--force ... functionsデプロイ時 delete 操作が入っているときに確認処理が挟まってデプロイができなくなるのを防ぐ

- 別環境の設定を import
> https://ginpen.com/2019/06/01/firestore-indexes-json/

firebase firestore:indexes ... 在設定されている rule や index を表示
firebase firestore:indexes > firestore.indexes.json


## Integrate web frameworks
### Serve static content
- New proj
```
firebase experiments:enable webframeworks
firebase init hosting

```
- Existing proj
Config 'source' `{ "hosting": { "source": "./path-to-your-express-directory" } }` in firebase.json
Define in package.json 'scripts.build' to output and `directories.serve` to point to the output path
### Serve dynamic content
In addition to above, set `files` to include everything necessary for the server and `main` for entry point  in package.json
```ts: entry point file
export function app() { // Either export 'app'
  const server = express()
  return server
}
export function handle(req, res) { // Or export 'handle'
```
---

serve static/dynamic -> Then deploy

- Access the authentication context, "firebaseApp" and "currentUser".
The web framework-aware Firebase deploy tooling will automatically keep client and server state in sync using cookies. 
 - Express.js: `res.locals`
 - Next.js: `getServerSideProps` `const firebaseApp = getApp(useRouter().query.__firebaseAppName)` (gets the authenticated Firebase App)
   - Billing required for SSR
   - Not need modify package.json


## Config
- Priority
1. Reserved namespaces that begin with a /__/* path segment
2. Configured redirects
3. Exact-match static content
4. Configured rewrites
5. 404.html
6. Default 404 page

{
  "hosting": {

    "public": "dist/app",  // "public" is the only required attribute for Hosting

    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    
    "redirects": [ {
      "source": "/foo", // not /foo/**. "/foo{,/**}" contains /foo,/foo/**
             // "/blog/:post*",  // captures the entire URL segment beginning at "post"
             // "/users/:id/profile",  // captures only the URL segment "id", but nothing following
      "destination": "/bar",
                  // "https://blog.myapp.com/:post", // includes the entire URL segment identified and captured by the "source" value
                  // "/users/:id/newProfile",  // includes the URL segment identified and captured by the "source" value
      "type": 301 // for 'Moved Permanently', 302 for 'Found' (Temporary Redirect)
    }, {
      "source": "/firebase/**",
   // "regex": "/blog/(?P<post>.+)" // regex PCRE2 captures (?P ) -> use as ":post" in "destination"
   // "regex": "/users/(\d+)/profile",  // uses the \d directive to only match numerical path segments
      "destination": "https://www.firebase.com",
                  // "/users/:1/newProfile",  // the first capture group to be seen in the `regex` value is named 1, and so on
      "type": 302
    } ],

    "rewrites": [ {
      // Shows the same content for multiple URLs
      "source": "/app/**",
      "destination": "/app/index.html"
    }, {
      // Configures a custom domain for Dynamic Links
      "source": "/promos/**",
      "dynamicLinks": true
    }, {
      // Directs a request to Cloud Functions
      "source": "/bigben",
      "function": "bigben"
    }, {
      // Directs a request to a Cloud Run containerized app
      "source": "/helloworld",
      "run": {
        "serviceId": "helloworld",
        "region": "us-central1"
      }
    } ],

    "headers": [ {
      "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
      "headers": [ {
        "key": "Access-Control-Allow-Origin",
        "value": "*"
      } ]
    }, {
      "source": "**/*.@(jpg|jpeg|gif|png)",
      "headers": [ {
        "key": "Cache-Control",
        "value": "max-age=7200"
      } ]
    }, {
      "source": "404.html",
      "headers": [ {
        "key": "Cache-Control",
        "value": "max-age=300"
      } ]
    } ],

    "cleanUrls": true,

    "trailingSlash": false,

    // Required to configure custom domains for Dynamic Links
    "appAssociation": "AUTO",

  }
}
