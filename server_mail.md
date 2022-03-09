## メール送信
### メール送信設定
```xml: property.xml
<feed>
<entry>
<!-- linkなど メール設定のために以下を追記する -->
  <rights>_mail.from.personal=EMailの送信元名
_mail.from=Emailのfrom
_mail.transport.protocol=smtpsなどのメール送信プロトコル
_mail.password=メール送信アカウントのパスワード
_mail.smtp.host=メール送信ホスト
_mail.smtp.port=メール送信ポート
_mail.smtp.auth=true/false</rights>
</entry>
</feed>
```
### メール送信
```tsx: /server/sendmail.tsx
import * as vtecxapi from 'vtecxapi'

const mailentry = {
  entry: {
    title: 'sendmail テスト',
    summary: 'hello text mail', // htmlメールが送信できない場合のテキストメールの内容
    content: {
      ______text: `<html><body><pre>
      hello html mail
      <img src="CID:/_html/img/ajax-loader.gif">  ${/* インライン画像　CIDの後にKey */}
      </pre></body></html>`
    }
  }
}
const to = ['xxxx@xxx']
const cc = ['xxxx@xxx']
const bcc = ['xxxx@xxx']
const attachments = ['/_html/img/vtec_logo.png']

vtecxapi.sendMail(mailentry, to, cc, bcc, attachments)
```
### リンクを添付
/Keyは任意
${URL} → WebサーバーのURL
${RXID=/Key} → キーと送信先メールアドレスのRXIDをつけたURL
${LINK=/Key} → キーと送信先メールアドレスのリンクトークンをつけたURL ログイン状態にならない
  Keyに対して許可される操作 検索, POST、PUT、DELETE, 配下へPOST(自動採番）
${RXID=/setpass.html}&value=abc → https://test.vte.cx/setpass.html?_RXID=xxx&value=abc
Keyに含まれる# → 送信先ユーザのUID
送信先が複数 または サービスにユーザー登録されていない (メールアドレスに含まれるアカウント使用可能文字から、アカウント検索される） →→ ブランクに変換
## メール受信
```ts: //server/getmail.ts
import * as vtecxapi from 'vtecxapi'

const settings: { [index: string]: string } = {}

// 基本設定(例：yahooメール)
settings['mail.pop3.host'] = 'pop.mail.yahoo.co.jp'
settings['mail.pop3.port'] = '995'
// タイムアウト設定
settings['mail.pop3.connectiontimeout'] = '60000'
//SSL関連設定
settings['mail.pop3.socketFactory.class'] = 'javax.net.ssl.SSLSocketFactory'
settings['mail.pop3.socketFactory.fallback'] = 'false'
settings['mail.pop3.socketFactory.port'] = '995'

settings['username'] = 'xxxxx@yahoo.co.jp'
settings['password'] = 'xxxxx'

const result = vtecxapi.getMail(settings)
vtecxapi.log(JSON.stringify(result))

// { feed: { entry: [{
// title: subject
// subtitle: cc
// summary: メール本文
// content: 添付ファイル(Base64形式)
// content.type: ファイルの形式
// content.src: ファイル名
// }, ...]}}
```
