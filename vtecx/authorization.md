## 認証

### リンクトークン 時間制限なし アクセスできるURLを指定 メール内で使用 ログイン状態にならない
GET ?_linktoken={KEY1[,KEY2[, ...]]}
KEYに対して許可される操作 検索, POST、PUT、DELETE, 配下へPOST (id項目自動採番）
KEYに含まれる#はuidに変換

### アクセスキー
PUT /d/?_accesskey →アクセストークン, リンクトークンを無効にする
/_user/{uid}/accesskeyに格納

### アクセストークン 時間制限なし スマホログイン認証時, サービスデプロイ時 ログイン状態にならない
ログイン後 GET /d/?_accesstoken
リクエストヘッダに追加して認証 `Authorization : Token {Accesstoken}`

### RXID ワンタイム ハッシュ スマホログイン認証時、サービス間通信時 ログイン状態
ログイン後、GET /d/?_getrxid
GET /d/?_RXID={RXID文字列}
リクエストヘッダ `Authorization: RXID {RXIDトークン}`

設定 /_settings/properties.xml rightsタグ
_rxid.minute={有効時間(分)} デフォルト15
_rxid.counter.{連番}.{回数}={同じRXIDを{回数分}使用できる対象URL正規表現}

スマホログイン認証
npm install vtecxauth
vtecxauth.getRXID(ユーザーアカウント, パスワード、 サービス名, APIキー(管理画面で確認))
↓cookieの代わりにアクセストークンを使用 タイムアウトなし, ログインなし,(→ セッションなし)

```ts
// 初回 RXIDで認証してcookieを保存
const rxid = vtecxauth.getRXID(useraccount, password, servicename, apikey)
axios({
    url: 'http://{サービス名}.vte.cx/d',
    method: 'get',
    headers: {
        'Authorization: RXID '+ rxid,
        'X-Requested-With': 'XMLHttpRequest'
    }
}).then((result) => {
    cookie = result.headers['set-cookie'][0].split(';')[0]  // cookieを保存
})

// 以降(cookie認証)
axios({
    url: 'http://{サービス名}.vte.cx/d',
    method: 'post',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': cookie
    },
    data : reqdata
})
```
vtecxapi.RXID(): string RXIDを取得

### APIキー 他サービスのサーバサイドスクリプト実行
サービス管理者(権限所有者)が PUT /d/?_apikey APIキー更新 前は無効
