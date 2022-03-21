## 署名
エントリのlink項目のKEY(selfかalias)に署名をつけることでユーザが承認したことを記録
<link rel="{self | alternate}" href="{KEY}" title="{REVISION},{uid},{署名}" /> `{ link: [{ ___rel:'{self|alternate}', ___href: '{KEY}', ___title: '{REVISION},{uid},{署名}' }] }`

ユーザーが、Update(PUTリクエスト)権限を有する/_user/{ログインしている自uid}/{KEYの残り部分} に対して PUT {KEY}?_signature&_revision={REVIISION(任意項目)}
成功200 A signature has been applied. ログインしていない場合401 KEYに署名する権限がない場合403
既に署名が付いている場合はREVISIONを+1し、updated項目を更新

### 署名削除 DELETE {KEY}?_signature linkタグのtitle属性に-が設定
成功200 ログインしていない場合401 KEYに署名する権限がない403

### 署名検証 GET {署名検証したいKEY}?_signature キーのエントリーの参照権限が必要
成功200 署名不正412 The signature is invalid. キーのエントリー参照権限なし403
