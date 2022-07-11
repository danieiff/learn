## ユーザー →個人情報、権限
### メールアドレスとアカウント
メール認証 → ユーザー登録
メールアドレス = ログインID (+以降@までを無視して送信しますが受信では無視しない。ピリオド(.)無視 Gmailのルールを使用)
ユーザーアカウント メールアドレス → 小文字に変換 英数字-_@$.以外と、@より前の.を削除
uid システムによる自動連番のユーザー識別番号

ユーザ(エントリ) /_user/{uid}
contributor.email メールアドレス →検索 `/_user?contributor.email-eq-${email}`
summary ユーザの状態(ステータス)
  登録なし: Nothing
  仮登録：Interim 登録画面から仮登録しユーザに確認メールが送られる
  本登録：Activated メール内リンクをクリックすることで本人認証される サービスを使うことができる
  無効：Revoked
  退会：Cancelled
title ユーザーアカウント
subtitle ニックネーム (使わない)

GET /d/?_whoami 現在ログインしているユーザエントリ ログインしていない場合 401
PUT /d/?_revokeuser={ユーザアカウント} 一時Revokdedにする ユーザ管理者が実行可 (?_deleteuserと同じ指定方法)
PUT /d/?_activateuser={ユーザアカウント} ↑をActivatedにする (?_deleteuserと同じ指定方法)
DELETE /d/?_canceluser ログインユーザ Cancelledに変更 ログインユーザ自身のみ実行可
GET /d/?_uid feedのtitleに自uidがセット ログインしていない場合 401
GET /d/?_account feedのtitleにユーザアカウントがセット ログインしていない場合 401
GET /d/?_login ログイン画面 ログイン認証が行われセッションを開始 パスワードはハッシュ化され、ワンタイムトークン(WSSE)としてリクエストされます。２回のログイン認証に失敗するとreCAPTCHA認証が必要
GET /d/?_logout セッションが破棄

### ユーザ仮登録 reCAPTCHAが必要
メール送信設定 /_settings/adduser
```ts
const data = [
  {
    contributor: [{uri: 'urn:vte.cx:auth:{ユーザーアカウント},{vtecxauth.getHashpass(ユーザ入力パスワード)}'},{name: '{ニックネーム(任意項目)'}],
    // ↓ 省略すると、/_settings/adduserの設定がメールに使われる メール設定なければエラー412(Precondition Failed)
    title: '{メールタイトル}',
    summary: '{テキストメール本文}', // HTMLメールが表示できないとき
    content: '{HTMLメール本文}'
  }
]
// POST /d?_adduser&g-recaptcha-token=${キャプチャトークン}
```
ユーザーステータスがInterim"(仮登録)、"Cancelled"(退会)なら上書き、以外なら409エラー(登録済み)
メール本文に${RXID=KEY}を含める ユーザーがワンタイムトークン(RXID)がついたURLを踏むと本登録

### 管理者によるユーザ登録
PUT /d?_adduserByAdmin
ユーザ管理者(/_group/$useradmin/配下のユーザー)が実行して、複数のエントリ(複数のユーザ)を本登録
リクエストデータであるフィードの、エントリは↑の{ユーザーアカウント}を{メールアドレス}にしたもの
メール項目を省略すると/_settings/adduserByAdminエントリでメール送信する

サーバーサイドスクリプトで vtecxapi.adduserByAdmin(feed: any): any	管理者権限でユーザを追加する
### パスワードリセット reCAPTCHA必要
```tsx
const data = [
  {
    contributor: [ { uri: `urn:vte.cx:auth:${email}` } ],
    title: '【魂寅】パスワード変更',
    summary: 'パスワードを変更します。下記リンクをクリックして魂寅のパスワード変更を完了してください。${URL}?${PASSRESET_TOKEN}'
    // メールエントリ /_settings/passreset で代替
  }
]
// PUT /d?_passreset&g-recaptcha-token=${captcha} data
```
メール記載URLのリンク先で↓リクエスト
```ts
 const data = [
   {
     contributor: [
       {uri: 'urn:vte.cx:auth:,{パスワード}'},
       {uri: 'urn:vte.cx:oldphash:{旧パスワード}'} // または {uri: 'urn:vte.cx:passreset_token:{パスワード変更一時トークン}'}
     ],

   }
 ]
 // PUT /d?_changephash data
 ```
### 管理者によるパスワードリセット
```ts
const data = [
  {
    contributor: [ {uri: 'urn:vte.cx:auth:,{パスワード}'} ],
    link: [ { ___rel: 'self', ___href: '/_user/{UID}_auth' }]
  }
]
// PUT /d?_changephashByAdmin
```
`vtecxapi.changepassByAdmin(data)`も同じ
ユーザ管理グループのみ実行可
### ユーザー初期フォルダ
ユーザー初ログイン ↓が生成される
/user/{UID}
/user/{UID}/acesskey
/user/{UID}/group
/user/{UID}/login_history
{/_settings/adduserinfo summaryタグで定義されたフォルダ} 例 ↓
/setup/_settings/adduserinfo.xml
KEYの#は登録ユーザーのuidで置換
<entry>
  <link rel="self" href="/_settings/adduserinfo" />
  <summary>/#/aaaa
{ユーザ登録時に作成されるフォルダのKEY} ...
/#/bbbb</summary>
</entry>

### パスワード変更
PUT /d/?_changephash ログイン中のアカウントに対して実行する reCAPTCHAなし
```ts
const data = [{
  contributor: [ {uri:'urn:vte.cx:auth:,{パスワード}' } ]
}]
```
### 管理者によるパスワード変更
ユーザ管理者が実行する ?_adduserByAdminで作成されたユーザのパスワードのみ変更可
PUT /d?_changephashByAdmin
```ts
const data = [
  {
    contributor: [{ uri: 'urn:vte.cx:auth:,{パスワード}' }],
    link: [{ ___rel: 'self', ___href: '/_user/{UID}/auth' }]
  }
  // , ...複数エントリ
]
```

### アカウント変更
ログインユーザー自身
PUT /d?_changeaccount アカウント変更のためのメール送信 リクエストデータにメールエントリがなければ/_settings/changeaccountエントリのメール設定が使われる
```ts
const data = [{
  contributor: [{ uri: 'urn:vte.cx:auth:{メールアドレス}' }],
  title: 'メールタイトル(任意)',
  summary: 'メール本文(任意)'
}]
```
メール本文に認証コードつきURL変換文字列'${VERIFY}'を挿入
リンクから、PUT /d?_changeaccount_verify={認証コード} アカウント変更を実行
メールアドレスをユーザアカウントに変換したものが全ユーザーエントリのtitle項目(ユーザーアカウント)に見つかればエラー
リクエストデータにメールエントリがなければ エントリを使われる

サービス作成者のアカウント変更は作成したサービスとシステム管理サービスでアカウント変更する
PUT /d?_changeaccount_verify={認証コード}&_RXID={RXID}
ログインユーザー自身

### アカウント削除
DELETE /d?_deleteuser={アカウント} (1ユーザー)
DELETE /d?_deleteuser リクエストデータ↓ (複数ユーザー)
```ts
const data = [{
    link: [{___rel: 'self', ___href: '/_user/{uid}'}],
    title:'{アカウント|uid}'
} //, ...アカウントエントリ ]
```
## ユーザーの、エントリに対する権限をグループ単位で管理する
それ以外のグループ
### システムグループ
ユーザーがグループ参加 /_group/{グループ名}/{uid}と/_user/{uid}/group/{グループ名}で互いをalias追加
サービス管理権限 /_group/$admin サービス作成、削除、アプリケーションログの参照やACLやindexなどの設定 <contributor>、<rights>タグの内容を編集 /_settingsフォルダにはサービス管理権限のACL(CRUD)が付与されている
ユーザー管理権限 /_group/$useradmin ユーザ作成、削除、ユーザステータスの変更、パスワード変更
コンテンツ管理権限：/_group/$content HTML,JavaScriptファイルやコンテンツの登録、削除
<content>タグのテキストノードの内容を更新

### ユーザー作成グループ
グループが/_user/{uid}配下にない時はあるのか
{uidユーザ}作成グループ /_user/{uid}/{グループ名}
{uidユーザ}が参加グループ(他ユーザーが作成) /_user/{uid}/group/{グループ名}
```ts
const data = [{
  link: [
    { ___rel: 'self', ___href: '{グループのKEY}/{参加者UID}'},
    {___rel: 'alternate', ___href: '/_user/{参加者UID}/group/{グループ名}'}
  ]
} /* , ...他ユーザーのグループ参加のエントリ */]
```
グループ作成者がPUT /d/{上のエントリのselfのkey}?_signature
グループ参加者がPUT /d/{上のエントリのalternateのkey}?_signature
ユーザーがグループに追加される

### それ以外のグループ
グループ作成
サービスのリソース上にシステムフォルダ以外の任意のフォルダを用意し、これをグループとする
(1) 作成者(UID:123)が権限(CRUD)を持つ、
(2) グループ自体(/groupS/group_123)が権限(CRUD)を持つ、
(3) グループ(/groupS/group_123)を作成する
const group_creation_entry = {
  contributor: [
    { uri: 'urn:vte.cx:acl:123,CRUD' }, /*(1)*/
    { uri: 'urn:vte.cx:acl:/groupS/group_123,CRUD' } /*(2)*/
  ],
  link: [
    { ___rel: 'self', ___href: '/groupS/group_123' } /*(3)*/
  ]
}

グループに対して (1)参加するユーザを配下に登録 (2)それのエイリアスを登録
const owner_participation_entry = {
  link: [
    { ___rel: 'self', ___href: '/groupS/group_123/123'}, /*(1)*/
    { ___rel: 'alternate', ___href: '/_user/123/group/group_123'} /*(2)*/
  ]
}
const guest_participation_entry = {
  link: [
    { ___rel: 'self', ___href: '/groupS/group_123/456'},
    { ___rel: 'alternate', ___href: '/_user/456/group/group_123'}
  ]
}

グループ作成者が下をPOSTする。 グループは作成され、グループ作成者はこれに所属します
const feed = [ group_creation_entry, owner_participation_entry ]

グループ招待/参加申請　を送る
UID:456のユーザを招待します
グループに対して権限を持つユーザ(作成者など)が[グループ作成の手順2]をユーザに対して実行します
下をPOST
const feed = [ guest_participation_entry ]

招待を送る親ユーザ/参加申請を送る子ユーザが　PUT: /groupS/group_123/456?_signature
PUT: {guest_paritcipation_entry の self のURL}?_signature　の形式
受ける親/子ユーザが　PUT: /_user/456/group/group_123?_signature
PUT: {guest_participation_entry の alternate のURL}?_signature　の形式
手順2と3の後、URLのselfとalternateの対応が確認されると、ユーザーはグループに参加させられる

### フォルダACL
フォルダ(エントリ)のcontributor項目
<contributor>
    <uri>urn:vte.cx:acl:{UID(先頭と末尾にワイルドカード(*)指定可)|*(全ユーザ)|+(ログインユーザ)|グループKEY(ワイルドカード {途中までのKEY}*)複数指定可},{C|R|U|D|E|.|/(複数指定可)}</uri>
</contributor>
E./　単体指定不可
(C)reate (R)ead (U)pdate (D)elete (E)xecutable file(サーバサイドスクリプトだけ実行可能)
.(このエントリのみ 配下には適用されない) /(配下のみ このエントリには適用されない) デフォルトで./

フォルダの階層が低いACLが優先される aliasもACL適用される

PUT /d/?_addacl ACL追加
PUT /d/?_removeacl ACL削除
```ts
const data = [{
  contributor: [{ uri: 'urn:vte.cx:acl:{ACLスコープ},{ACL種類}' }],
  link: [{ ___rel: 'self', ___href: '{KEY}' }]
}]
```

### エントリ項目ACL
/_settings/template rightsタグ
{エントリ項目名}[{Index設定}|#(暗号化項目設定)]={{UID|groupのKEY(url)}+{R|W|RW (読み書き)}[, ...複数件]}

## 署名
エントリのlink項目のKEY(selfかalias)に署名をつけることでユーザが承認したことを記録
<link rel="{self | alternate}" href="{KEY}" title="{REVISION},{uid},{署名}" /> `{ link: [{ ___rel:'{self|alternate}', ___href: '{KEY}', ___title: '{REVISION},{uid},{署名}' }] }`

ユーザーが、Update(PUTリクエスト)権限を有する/_user/{ログインしている自uid}/{KEYの残り部分} に対して PUT {KEY}?_signature&_revision={REVISION(任意項目)}
成功200 A signature has been applied. ログインしていない場合401 KEYに署名する権限がない場合403
既に署名が付いている場合はREVISIONを+1し、updated項目を更新

### 署名削除 DELETE {KEY}?_signature linkタグのtitle属性に-が設定
成功200 ログインしていない場合401 KEYに署名する権限がない403

### 署名検証 GET {署名検証したいKEY}?_signature キーのエントリーの参照権限が必要
成功200 署名不正412 The signature is invalid. キーのエントリー参照権限なし403

## DoS攻撃対策
ログイン失敗で/_security/{アカウント認識文字列}/{IPアドレス}の認証失敗カウンタが1000回(デフォルト)を超えると、ユーザ・IPアドレスの組み合わせがIP Blacklistに追加されてリクエストは認証エラーになる
アカウント認識文字列は、WSSEやRXIDの場合はアカウント、AccessTokenやLinkTokenの場合はuid
ブロック解除
最後の認証失敗から24時間後(デフォルト)
認証失敗カウンタを0にする DELETE /d/_security/{アカウント認識文字列}/{IPアドレス}?_cachelong
