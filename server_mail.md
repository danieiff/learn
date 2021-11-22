`property.xmlのrights`にメール送信設定
```
_mail.from.personal : EMailの送信元名
_mail.from : Emailのfrom
_mail.transport.protocol : smtpsなどのメール送信プロトコル
_mail.password : メール送信アカウントのパスワード
_mail.smtp.host : メール送信ホスト
_mail.smtp.port : メール送信ポート
_mail.smtp.auth : true/false
他に、APIKEYなどのために項目が必要
```
`sendMail(entry: any, to: string[] null, cc?: string[], bcc?: string[], attachments?: string[]): void`	メールを送信する
`getMail(settings: any): any`	メールを受信する
#### メール送信
`vtecxapi.sendMail(entry: any, to: string[] | null, cc?: string[], bcc?: string[], attachments?: string[])`
entry
title: メールのタイトル
summary: テキストメール本文(必須)
content: HTMLメール本文(任意、インライン画像を指定可能)
to: 送信先アドレス (複数指定の場合配列で指定)
cc: CCでの送信先アドレス (配列で指定)
bcc: BCCでの送信先アドレス (配列で指定)
attachments: 添付ファイル(コンテンツのキーを複数指定可能)

HTMLメールを送信できない場合はテキストメールが送信されます。
HTMLメールのインライン画像は <img src="CID:/_html/img/ajax-loader.gif">のように、CIDに続けてキーのURLを指定します。
#### 実装例
```tsx: /server/sendmail.tsx
import * as vtecxapi from 'vtecxapi'

const mailentry = {
  'entry': {
    'title': 'sendmail テスト',
    'summary': 'hello text mail',
    'content': {
      '______text': '<html><body>hello html mail <img src="CID:/_html/img/ajax-loader.gif"></body></html>'
    }
  }
}

const to = ['xxxx@xxx']
const cc = ['xxxx@xxx']
const bcc = ['xxxx@xxx']
const attachments = ['/_html/img/vtec_logo.png']

vtecxapi.sendMail(mailentry, to, cc, bcc, attachments)
```
あらかじめ`/_settings/properties.xml`か管理画面から設定

_mail.from={送信元アドレス}
_mail.from.personal={送信者名}
_mail.password={認証アカウントのパスワード}
_mail.transport.protocol={送信プロトコル}   // "smtp"または"smtps"(Gmailはこちら)。デフォルトは"smtp"。
_mail.smtp.host={SMTPサーバ}
_mail.smtp.port={SMTPポート番号}
_mail.smtp.auth={認証する場合true(デフォルトはtrue)}
_mail.smtp.starttls.enable={STARTTLSを利用する場合true(デフォルトはtrue)}
以下はgmailで送信するための設定例です。

_mail.from=foo@gmail.com
_mail.from.personal=foo
_mail.password=xxx
_mail.transport.protocol=smtps
_mail.smtp.host=smtp.gmail.com
_mail.smtp.port=587
_mail.smtp.auth=true

認証付きリンク

送信するメール本文(テキストメールおよびHTMLメール)に以下の文字列が設定されている場合に認証トークンに変換します。例えば、メールの本文に${RXID=Key}を挿入することで、RXIDを含むURLが自動的に組み立てられます。RXIDは送信先のアカウントのものが生成されます。Keyにはコンテキストパスまで自動的に付加されるためそれ以降のパスを指定してください。

${URL} : URLに変換
${RXID=/Key} : キーと送信先メールアドレスのRXIDをつけたURLを組み立てて変換
${LINK=/Key} : キーと送信先メールアドレスのリンクトークンをつけたURLを組み立てて変換
挿入文: ${RXID=/setpass.html}&value=abc
実際のメール本文: https://test.vte.cx/setpass.html?_RXID=xxx&value=abc
また、変換に際して以下のようなルールがあります。

変換は送信先が1件の場合のみ。送信先を複数指定している場合はブランクに変換さる
送信先メールアドレスがそのサービスでユーザ登録されていない場合はブランクに変換される。(※正確にはメールアドレスからアカウント使用可能文字だけ取り出し、アカウントを検索しています）
キー指定部分(/Key)に#が設定されている場合は送信先ユーザのUIDに変換される。
メール受信

vtecxapi.getMail(settings)によりメールを受信することができます。受信結果はfeedのentryに格納されます。複数件受信すると複数件のentryが返ります。
feed.entryの各項目には以下のようにメールの情報がセットされます。()が対応するメールの情報

title(subject)
subtitle(cc)
summary(メール本文)
content(添付ファイル) ※ Base64に変換されます
content.type(ファイルの形式)
content.src(ファイル名)
vtecxblankのmail受信サンプル(/server/getmail.js)では、/s/getmailにアクセスすると、Yahoo!メールの設定情報を元にメールを受信します。
vtecxapi.getMail(settings)のsettingsパラメータにはメール受信のための設定を入れます。

mail受信サンプル(/server/getmail.js)

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