#### vte.cxのフロントエンド開発の世界観
クライアントサイド(SPAなどのView) + BFF(サーバーサイドのビジネスロジック, SSR) + サーバー設定(サービス管理画面、システムフォルダ`/setup`からデータベースなどを設定する)
#### BFFでの開発手順
1. `/server`配下に*{スクリプト名}.~~js/jsx~~/ts/tsx/*を置く。エントリーポイントは1階層目
2. `npm run login`　ログインしているサービスにデプロイされる。
3. `npm run watch -- --env entry=/server/{目的のファイル名}` **ES5**へ変換
4. `GET|POST|PUT /s/{スクリプト名}`と呼び出す。
最大実行時間5分のデフォルトの同期リクエストに対して、`_async`パラメータを付ける非同期リクエスト: 別スレッドが起動し、`202 Accepted`を返す。 バッチジョブサーバで、設定されたタイムアウト時間を最大実行時間として処理される。
#### SSR
以下のファイルssr.html.tsxをビルド&デプロイ後、/s/ssr.htmlにブラウザからアクセルできる。
```tsx: server/ssr.html.tsx
import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

const element =  <h3> Hello, World! </h3>
const html = ReactDOMServer.renderToStaticMarkup(element)
vtecxapi.doResponseHtml(html)
```
#### JSONを返す
```ts
import * as vtecxapi from 'vtecxapi'
const feed = vtecxapi.getFeed('/foo') // 変換→json, /foo?x→xml, /foo?m→message pack
vtecxapi.doResponse(feed)
```
#### 検索
レスポンスの最初のエントリのrightsに文字列(nextpagelink)が格納されているとき:
次ページが存在することを示します。次のリクエストにて、p={nextpagelink}パラメータを付けることで次ページを取得できます。
```ts
import * as vtecxapi from 'vtecxapi'
const param = encodeURIComponent(vtecxapi.getQueryString('param'))
const feed = vtecxapi.getFeed('/foo?param=' + param)   // /registration?xでxmlになる
vtecxapi.doResponse(feed)
```
#### ファイルアップロード
raw形式, ブラウザから直接アップロードできるFormDataオブジェクト(multipart/form-data形式)
アップロードファイルが一つでありキーも指定されていないとき: ファイル名がエントリのKey
複数のとき:
`vtecxapi.saveFiles(param)`paramオブジェクトに、inputタグのnameをキーにして任意のファイル名を設定→`http://{サービス名}.vte.cx/{アップロードファイル名}`でブラウザで表示
:::details 実装例
```tsx: src/components/UploadPictureForm.tsx
// 諸々import
interface Props {
    picture1: any,
    picture2: any,
    [propName: string]: any
}
const UploadPictureForm: React.VFC<Props> = (props) => {
  const [state,setState] = useState( { picture1:{}, picture2:{} } )
  const handleChange = (e: React.FormEvent<any>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files.item(0)
      if (file) {
        const key = '/_html/img/' + encodeURIComponent(file.name)
        const name = e.currentTarget.name
        // 画像以外は処理を停止
        if (!file.type.match('image.*')) return
        // 画像表示
        const reader = new FileReader()
        reader.onload = () => setState( { [name]: { value: reader.result, key: key } } )
        reader.readAsDataURL(file)
      }
    }
  }
  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const param = (state.picture1.key ? 'key1=' + state.picture1.key + '&' : '') +
        (state.picture2.key ? 'key2=' + state.picture2.key : '')

    // 画像は、/d/_html/img/{key} としてサーバに保存される
    try {
      await axios.post( '/s/savefiles?' + param, formData, { headers: { 'X-Requested-With': 'XMLHttpRequest' } } )
    } catch(e) {
      alert(e.response? 'error: ' + JSON.stringify(e.response): 'error')
    }
  }
  return (
    <Form horizontal onSubmit={handleSubmit}>
      <img src={state.picture1.value} />
      <br />
      <img src={state.picture2.value} />
      <br />
      <FormGroup>
        <FormControl type="file" name="picture1" onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <FormControl type="file" name="picture2" onChange={handleChange} />
      </FormGroup>
        <FormGroup>
          <Button type="submit" className="btn btn-primary">
            登録
          </Button>
      </FormGroup>
    </Form>
  )
}
```
```ts: /server/SavePicture.ts
import * as vtecxapi from 'vtecxapi'

interface Param {
    picture1: string
    picture2: string
}
const param: Param = {
    picture1: vtecxapi.getQueryString('key1'),
    picture2: vtecxapi.getQueryString('key2')
}
vtecxapi.saveFiles(param)
```
:::
#### CSVアップロード
`vtecxapi.getCsv(header[],items[],parent,skip,encoding)`
header: CSVのヘッダ情報 ≠>異なればパースエラー `{"feed":{"entry":[{"title" : "Header parse error"}]}}`
items: 対応するJSONの項目名 `'item1(int/boolean)'`カッコの中で型を指定可能
parent: 変換後のJSONの親項目を指定する。
skip: CSVファイルの読み飛ばす行数
encoding: 文字コード(*UTF-8*,*Windows-31J*等)
:::details 実装例
```tsx: /src/components/UploadCsv.tsx
// import
const UploadCsvForm: React.VFC = () => {
  const [state, setState] = useState({})
  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // 画像は、/d/foo/{key} としてサーバに保存されます
    try {
      await axios.post( '/s/getcsv', formData, { headers: { 'X-Requested-With': 'XMLHttpRequest' } } )
    } catch(e) {
      alert(e.response? 'error: ' + JSON.stringify(e.response): 'error')
    }
  }
  return (
    <Form horizontal onSubmit={handleSubmit}>
      <FormGroup>
        <FormControl type="file" name="csv" />
      </FormGroup>
        <FormGroup>
          <Button type="submit" className="btn btn-primary">
              登録
          </Button>
        </FormGroup>
    </Form>
  )
}
```
```tsx: /server/GetCsv.ts
import * as vtecxapi from 'vtecxapi'

const items = ['item1', 'item2(int)', 'item3(int)']
const header = ['年月日', '件数', '合計']
const parent = 'order'
const skip = 1
const encoding = 'UTF-8' //const encoding = 'Windows-31J'
// CSV取得
const result = vtecxapi.getCsv(header, items, parent, skip, encoding)
vtecxapi.log(JSON.stringify(result))
```
```
CSVデータ(/data/sample.csv)
// 1行skip
年月日,件数,合計
"2017/7/5",3,3
"2017/7/6",5,8
"2017/7/7",2,10
```
:::
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
:::details 実装例
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
:::
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
BigQuery連携

vtecxapi.postBQ(request,async,tablenames?)によりBiqQueryにデータを登録することができます。(※ BigQuery連携を使うには事前に設定が必要です。詳しくは、システムフォルダと各種設定を参照してください)
requestはエントリスキーマで定義されたJSONオブジェクトになります。第一階層の項目名がテーブル名に対応します。tablenamesに第一階層の項目名とテーブル名を指定することで異なる名前をテーブル名に指定することができます。tablenamesには、tablanames['{エンティティの第一階層名}']='{Bigqueryテーブル名}' を指定します。例えば、エンティティの第一階層名がfooでテーブル名がbarの場合、const tablenames = { foo : 'bar' }になります。BigQueryのスキーマはエントリスキーマから自動的に作成されるため定義する必要はありません。
エントリスキーマ以外では、key (STRING)、updated (DATETIME)、deleted (BOOL)項目が自動的に登録されます。

vtecxapi.deleteBQ(keys,async,tablenames?)により、BigQueryのデータを削除することができます。これは論理削除であり、実際にはdeletedがtrueのレコードが登録されます。

vtecxapi.getBQ(sql,parent)で登録したデータをJSONとして取得できます。sqlにはBigQueryにおいて実行できるSQL文を指定してください。
また、doResponseBQcsv(sql,filename,header?)により、csvとしてダウンロードできます。
データの更新はなく常に追記される形になるため、sqlでは同じkeyでupdatedが最新かつdeletedがfalseのものを取得するようにしてください。
以下にサンプルコードを示します。

    import * as vtecxapi from 'vtecxapi'

    const reqdata = {
        'feed': {
            'entry': [{
                'foo': { 'bar': 'test', 'baz': 'テスト' },
                'link':
                [{ '___rel': 'self', '___href': '/footest/1' }]
            }
            ]
        }
    }

    vtecxapi.postBQ(reqdata,false)

    // 最新のレコードのみ取得
    const sql = 'select f.key,bar,baz,k.updated from my_dataset.foo as f right join (select key,max(updated) as updated from my_dataset.foo group by key) as k on f.updated=k.updated and f.key=k.key where f.deleted = false'
    const result = vtecxapi.getBQ(sql)
    vtecxapi.log(JSON.stringify(result))

    const keys = ['/footest/1']
    vtecxapi.deleteBQ(keys,true)

ちなみに、エントリスキーマ(/_settings/template)は以下の通りです。これがBigQueryのスキーマとしても使われます。(テーブル=foo、項目=bar,baz)

foo
 bar
 baz
バッチジョブ

サーバサイドJavaScriptをバックグラウンドで実行したい場合にはバッチジョブ機能が使えます。バッチジョブ機能は対象サービスのプロパティ(/_settings/propertiesエントリーのrights)に以下を設定することで動作させることができます。

_batchjob.{ジョブ名}={分} {時} {日} {月} {曜日} {サーバサイドJS名}
{ジョブ名}はサービス内で一意とする。(重複分のジョブは取得されず実行されない。)
{分} {時} {日} {月} {曜日}の部分はlinuxのcrontabコマンドと同じ指定方法。
{サーバサイドJS名}はリクエストで/s/の後に指定する値。(/_html/server/、.jsを含まない。)
以下は毎朝8:30にメール送信するサーバサイドJS(/server/send-mail.js)を実行する設定の例です。

_batchjob.sendmail=30 8 * * * send-mail
バッチジョブ管理テーブルを参照することでバッチジョブの実行結果を確認できます。これはジョブの実行ごとに登録されるため、ジョブの実行ステータスを記録するログとして扱うことができます。

/_batchjob/{ジョブ名}/{ジョブ実行時刻(yyyyMMddHHmm)}のエントリ
上記エントリのtitleにジョブ実行ステータス
subtitleにPod名
ジョブ管理ステータス

waiting : 実行待ち
running : 実行中
succeeded : 成功
failed : 失敗
waiting(実行待ち)のバッチジョブはプロパティの設定を削除することでキャンセルできますが、running(実行中)のバッチジョブはキャンセルできません。

サーバサイドJSタイムアウト設定

対象サービスのプロパティ(/_settings/propertiesエントリーのrights)に以下を設定することで各サービスにおけるサーバサイドJSのタイムアウト設定ができます。ただしこの設定はproductionサービスのみ有効となります。stagingサービスや設定がない場合などではデフォルトの値(300秒)が採用されます。

APサーバからの実行の場合: _javascript.exectimeout={タイムアウト秒}
バッチジョブ実行の場合: _javascript.batchjobtimeout={タイムアウト秒}
