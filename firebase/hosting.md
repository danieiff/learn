`firebase emulators:start`

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
https://ginpen.com/2019/06/01/firestore-indexes-json/

firebase firestore:indexes ... 在設定されている rule や index を表示
firebase firestore:indexes > firestore.indexes.json

