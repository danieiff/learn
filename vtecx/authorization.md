## 認証

### リンクトークン 時間制限なし アクセスできるURLを指定 メール内で使用 ログイン状態にならない
GET ?_linktoken={KEY1[,KEY2[, ...]]}
KEYに対して許可される操作 検索, POST、PUT、DELETE, 配下へPOST (id項目自動採番）
KEYに含まれる#はuidに変換

### アクセスキー
PUT /d/?_accesskey アクセスキーを更新することでアクセストークン, リンクトークンを無効にする
/_user/{uid}/accesskeyに格納

### アクセストークン 時間制限、セッションなし サービスデプロイ時 ログイン状態にならない
ログイン後 GET /d/?_accesstoken
リクエストヘッダに追加して認証 `Authorization : Token {Accesstoken}`

### RXID ワンタイム ハッシュ スマホログイン認証時、サービス間通信時 ログイン状態
ログイン後、GET /d/?_getrxid
GET /d/?_RXID={RXID文字列} か リクエストヘッダ `Authorization: RXID {RXIDトークン}`　でログイン

設定 /_settings/properties.xml rightsタグ
_rxid.minute={有効時間(分)} デフォルト15
_rxid.counter.{連番}.{回数}={同じRXIDを{回数分}使用できる対象URL正規表現}

スマホログイン認証
npm install vtecxauth
rxid = vtecxauth.getRXID(ユーザーアカウント, パスワード、 サービス名, APIキー(管理画面で確認))
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

# ソーシャルログイン
provider: facebook google github twitter yahoo
## Get https://{service}.alpha.vte.cx/o/{provider}/oauth/
→302 Location: GET https://admin.alpha.vte.cx/o/{provider}/oauth/?_service={サービス}
→302 Location: GET https://admin.alpha.vte.cx/o/{provider}/callback/
認可画面 ユーザー操作
→302 Location: GET https://{service}.vte.cx/o/{provider}/redirect/?state={secret}

- アカウントがソーシャルアカウントに紐づいている(以下のエントリが存在する)時
```xml
<entry>
  <link rel="self" href="/_oauth/{provider}/{ソーシャルアカウント}" />
  <link rel="alternate" href="/_user/{UID}/oauth/{provider}" />
</entry>
```
→ユーザーステータス Activated: ログイン; それ以外: 未ログイン扱い
- ログイン中 ソーシャルアカウントに紐づいていない:
→203: It is required to link social accounts with logged-in users.  CookieにOID={secret}を設定する。
プロバイダのメールアドレスを使用したい場合、ログアウトして再度ソーシャルログインを行ってもらう
- 未ログイン, ログイン中だがログインアカウントが別のソーシャルアカウント登録されている場合:
→203: It is required to regist email.  CookieにOID={secret}を設定する。

- 紐付けリクエスト
ログインユーザー POST /o/{provider}/link/ Cookie: OID={secret};SID={SID}
/_oauth/{provider}/{ソーシャルアカウント}エントリーを登録


## メールアドレス登録リクエスト
POST /o/{provider}/email/ Cookie: OID={secret}
```
  <feed>
    <entry>
      <contributor>
        <uri>urn:vte.cx:auth:{メールアドレス}</uri>
      </contributor>
    </entry>
  </feed>
```
同じプロバイダで既に登録済み: 409 Duplicated email. {メールアドレス}
- リクエストメールアドレスで::Activated::アカウントが存在しない:
ユーザー仮登録　パスワードはランダム
→メールにRXID付きURL (203 A confirmation email has been sent to your address.)
- する:
203 It is required to input password. ↓

## パスワード確認リクエスト
POST /o/{provider}/phash/ Cookie: OID={secret} reCaptcha必要
```xml
  <feed>
    <entry>
      <contributor>
        <uri>urn:vte.cx:auth:,{パスワード}</uri>
      </contributor>
    </entry>
  </feed>
```
→ ログイン

## ソーシャルアカウントの紐付け解除
DELETE /o/{provider}/oauthid ログイン状態 → 200 Social account is deleted.
- 管理者から
GET /d/_user/{UID}/oauth/{provider}?e このエントリーを通常の削除処理

### 分岐
プロバイダからメールアドレスが取得できる場合
既存アカウントを取得
メールアドレスを変換したアカウントでユーザエントリーを検索する。(/_user?f&title={アカウント})
エントリーが存在し、ユーザステータスがActivatedの場合、既存アカウントあり。
ログイン中の場合
既存アカウントが存在し、ログイン中アカウントと既存アカウントが一致。
→ 紐付けリクエスト依頼。
既存アカウントが存在し、ログイン中アカウントと既存アカウントが異なる。
→ 紐付けリクエストか、既存アカウントのパスワード確認リクエスト依頼。
既存アカウントが存在しない。
→ 紐付けリクエスト依頼。
プロバイダのメールアドレスを使用したい場合、ログアウトして再度ソーシャルログインを行ってもらう。
未ログインでの場合
既存アカウントが存在する場合
→ 既存アカウントのパスワード確認リクエスト依頼。
既存アカウントが存在しない場合
→ メールアドレス登録リクエスト依頼。(メールアドレスを返す)
プロバイダからメールアドレスが取得できない場合
ログイン中の場合
ログインアカウントのソーシャルアカウント登録チェック。
/_user/{UID}/oauth/{provider}
エントリーが存在しない場合 → 紐付けリクエスト依頼。
未ログインの場合、またはログイン中だが別のソーシャルアカウント登録がある場合。
→ メールアドレス登録リクエスト依頼。
各リクエスト依頼レスポンス

紐付けリクエスト依頼
203: It is required to link social accounts with logged-in users.
既存アカウントのパスワード確認リクエスト依頼。
203: It is required to input password.
紐付けリクエストか、既存アカウントのパスワード確認リクエスト依頼。
203: It is required to link social accounts with logged-in users or input password.
メール確認依頼
203: A confirmation email has been sent to your address.
メールアドレス登録リクエスト依頼
203: It is required to regist email.
プロバイダからメールアドレスが取得できる場合、subtitleにメールアドレスを設定して返却。
依頼応答リクエスト

紐付けリクエスト

リクエスト
POST /o/{provider}/link/ Cookie: OID={secret};SID={SID}
処理内容
ログインユーザのソーシャルアカウント登録済みチェック。
/_user/{UID}/oauth/{provider} を検索し、エントリーが存在する場合登録済みエラー。
CookieのOIDからsecretを取得し、Redisからソーシャルアカウントを取得。(存在しない場合エラー)
/_oauth/{provider}/{ソーシャルアカウント}エントリーを登録。エイリアスにログイン中ユーザのUIDを設定。(/_user/{UID}/oauth/{provider})
レスポンス
200: The link is completed.
既存アカウントのパスワード確認リクエスト

リクエスト
POST /o/{provider}/phash/ Cookie: OID={secret}
  <feed>
    <entry>
      <contributor>
        <uri>urn:vte.cx:auth:,{パスワード}</uri>
      </contributor>
    </entry>
  </feed>
reCaptchaを付けてリクエストする。
処理内容
reCapthcaチェック。
CookieのOIDからsecretを取得し、Redisからソーシャルアカウントとメールアドレスを取得。(存在しない場合エラー)
メールアドレスを編集したアカウントでユーザ情報を取得。(/_user?f&title={アカウント})
ユーザ情報のキーからUIDを取得し、/_user/{UID}/authエントリーを取得し、パスワードを抽出。
登録されたパスワードと、パスワード確認リクエストのパスワードを比較。異なっていればエラー。
パスワードが一致した場合、/_oauth/{provider}/{ソーシャルアカウント}エントリーを登録。エイリアスに既存アカウントのUIDを設定。(/_user/{UID}/oauth/{provider})
レスポンス
200: Logged in.
メールアドレス登録リクエスト

リクエスト
POST /o/{provider}/email/ Cookie: OID={secret}
  <feed>
    <entry>
      <contributor>
        <uri>urn:vte.cx:auth:{メールアドレス}</uri>
      </contributor>
    </entry>
  </feed>
処理内容
CookieのOIDからsecretを取得し、Redisからソーシャルアカウントを取得。(存在しない場合エラー)
送られてきたメールアドレスの既存アカウント存在チェック
既存アカウントが存在し、かつユーザステータスがActivatedの場合、UIDでソーシャルアカウントを検索。
/_user/{UID}/oauth/{provider}
同一プロバイダのソーシャルアカウントが存在する場合、メールアドレス登録済みエラーを返却。
409: Duplicated email. {メールアドレス}
同一プロバイダのソーシャルアカウントが存在しない場合 → 既存アカウントのパスワード確認リクエスト依頼。
既存アカウントが存在し、かつユーザステータスがBlockedの場合、認証エラー。
既存アカウントが存在し、かつユーザステータスがInterimの場合、ソーシャルアカウントエントリーを検索。
/_user/{UID}/oauth/{provider}
取得したEntryのキーにあるソーシャルアカウントと、Redisのソーシャルアカウントを比較。異なっていれば登録済みエラー。
既存アカウントが存在しない場合、次の処理に進む。
ユーザ仮登録処理 (既存の処理)(ユーザステータスがInterim以外)
UID新規発行
パスワード自動生成
/_user/{UID}エントリーのtitleにメールアドレスを変換したアカウントを登録。
/_user/{UID}エントリーのcontributor.emailにメールアドレスを登録。
/_user/{UID}エントリーのsummaryにInterim(仮登録)。
/_oauth/{provider}/{ソーシャルアカウント}エントリーを登録(ユーザステータスがInterim以外)。エイリアスに発行したUIDを設定。(/_user/{UID}/oauth/{provider})
RXIDを付けたメール送信。
→ メール確認依頼。


# Time based One Time Password (TOTP)
クライアント側にGoogle Authenticator(Android、iPhone)をインストールし、QRコード(後述)を読み取ることで設定
ワンタイムパスワードの制限時間は30秒
- 信頼できる端末 2段階認証をパス
Cookieに TDID={TDID} を設定
```xml
<entry>
  <link rel="self" href="/_user/{UID}/trusted_device" />
  <contributor>
    <uri>urn:vte.cx:secret:{TDID(信頼できる端末に指定する値)}</uri>
  </contributor>
</entry>
```
## 二段階認証
### 1.仮登録
ログイン中 POST /d/?_createtotp&_chs={QRコードの長さ} _chsは任意 デフォルト180
以下が登録される。重複ならエラー
```xml
<entry>
  <link rel="self" href="/_user/{UID}/totp" />
  <contributor>
    <uri>urn:vte.cx:secret:{公開鍵}</uri>
  </contributor>
</entry>
```
以下を上書きする
```xml
 <entry>
     <link rel="self" href="/_user/{UID}/totp_temp" />
     <contributor>
       <uri>urn:vte.cx:secret:{Google Authから生成された公開鍵}</uri>
     </contributor>
   </entry>
```
QRコードのURLをレスポンス
```xml
<feed>
  <title>https://chart.googleapis.com/chart?chs={_chsの値}x{_chsの値}&cht=qr&chl=「otpauth://totp/{サービス名}:{アカウント}?secret={公開鍵}&issuer={サービス名}」をURLエンコードした文字列</title>
</feed>
```

## 2. 本登録
ログイン中 POST /d/?_createtotp [{title: '{ワンタイムパスワード}'}]
/_user/{UID}/totpが既に存在すればエラー
ワンタイムパスワード: GoogleAuthenticatorで（１）で表示されたQRコードから読み取った数字6桁
成功→ /_user/{UID}/totp_tempが/_user/{UID}/totpに移される

## ログイン1
RXID認証
/_user/{UID}/totp なし:ログイン; あり: CookieからTDIDを取得 信頼できる端末: ログイン;
認証の2段階目: セッションに仮認証フラグがたつ

レスポンス: 203,
```xml
<feed>
  <title>Please send a one-time password.</title>
</feed>
```

## ログイン2
以下がヘッダに付与された任意のリクエストを送る
Authorization: TOTP {ワンタイムパスワード}
X-TRUSTED-DEVICE: true →信頼できる端末に加えたい場合は設定

セッションの仮登録フラグを削除
X-TRUSTED-DEVICEが指定されている場合、/_user/{UID}/trusted_deviceがなければ登録
- セッションに仮認証フラグが立っている場合、ワンタイムパスワード検証以外のリクエストであればステータス203を返す。メッセージも同様に返す。

## ２段階認証の解除
DELETE /d/?_deletetotp={管理者による削除時のみアカウントを指定(/一般ユーザーは指定しない)}
## QRコード参照
ログイン中 GET /d/?_gettotp&_chs={QRコードの長さ} _chsは任意 デフォルト180
QRコードURLをレスポンス
```xml
<feed>
  <title>https://chart.googleapis.com/chart?chs={_chsの値}x{_chsの値}&cht=qr&chl=「{otpauth://totp/{サービス名}:{アカウント}?secret={公開鍵}&issuer={サービス名}」をURLエンコードした文字列</title>
</feed>
```

## 信頼できる端末の削除
個別: ユーザにてその端末のCookieを削除
全部: ログイン中 PUT /d/?_changetdid (TDID 更新)  trusted device id
