### vte.cxのフロントエンド開発の世界観
クライアントサイド(SPAなどのView) + BFF(`/src/server`内、サーバーサイドのビジネスロジック, SSR、システムフォルダ`/setup`からデータベースなどを設定)
### BFFの開発手順
1. `/server`配下に*`{スクリプト名}.ts/tsx`*~~/js/jsx~~をおく
2. `npm run login`　→ログインしているサービスにデプロイされる
3. `npm run watch -- --env entry=/server/{目的のファイル名}` →**ES5**へ変換
4. `GET|POST|PUT /s/{スクリプト名}`と呼び出す。 →最大実行時間5分
  `_async`パラメータを付けると非同期リクエスト →別スレッドが起動し、`202 Accepted`を返す。 バッチジョブサーバで、設定されたタイムアウト時間を最大実行時間として処理される。
### ログ、エラー
- `vtecxapi.log(message: string, title?: string, subtitle?: string): void`
サービス管理画面からログを見れる
`JSON.stringify()`でJavascriptオブジェクトの内容を見る
- ランタイムエラーが発生すると、ステータスコードと`{ "feed": { "title": "エラー文" } }`のjsonオブジェクトをレスポンスする
### セキュリティ
- クエリパラメータの中で特殊文字をエスケープする
`encodeURIComponent(vtecxapi.getQueryString('param'))`
- ブラウザでのユーザー入力等をSQL等に含めるとき特殊文字をエスケープする
### SSR
`vtecxapi.doResponseHtml(html: string): void`
以下のファイルssr.html.tsxをビルド&デプロイ後、/s/ssr.htmlにブラウザからアクセルできる。
```tsx: server/ssr.html.tsx
import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

const element =  <h3> Hello, World! </h3>
const html = ReactDOMServer.renderToStaticMarkup(element)
vtecxapi.doResponseHtml(html)
```
### JSONを返す
`doResponse(feed: any, status_code?: number): void`
```ts
import * as vtecxapi from 'vtecxapi'
const feed = vtecxapi.getFeed('/foo') // 変換→json, /foo?x→xml, /foo?m→message pack
vtecxapi.doResponse(feed)
```
### 検索
レスポンスの最初のエントリのrightsに文字列(nextpagelink)が格納されているとき:
次ページが存在することを示します。次のリクエストにて、p={nextpagelink}パラメータを付けることで次ページを取得できます。
```ts
import * as vtecxapi from 'vtecxapi'
const param = encodeURIComponent(vtecxapi.getQueryString('param'))
const feed = vtecxapi.getFeed('/foo?param=' + param)   // /registration?xでxmlになる
vtecxapi.doResponse(feed)
```
### ファイルアップロード
- 形式はraw, ブラウザから直接アップロードできるFormDataオブジェクト(`multipart/form-data`形式)
- アップロードファイルが一つでありキーも指定されていないとき: ファイル名がエントリのKey
- 複数のとき:
`saveFiles(param: any): void`
param: `{ [inputタグのname] : '任意のファイル名' }` →`http://{サービス名}.vte.cx/{アップロードファイル名}`で表示
#### 実装例
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
### バッチジョブ
`/_settings/propertiesエントリーのrights`に以下を記述
`_batchjob.{ジョブ名}={分} {時} {日} {月} {曜日} {サーバサイドJS名}`
- {ジョブ名}はサービス内で一意とする。(重複分のジョブは取得されず実行されない。)
- {分} {時} {日} {月} {曜日}の部分はlinuxのcrontabコマンドと同じ指定方法。
- {サーバサイドJS名}はリクエストで/s/の後に指定する値。(/_html/server/、.jsを含まない。)
例`_batchjob.sendmail=30 8 * * * send-mail` 毎朝8:30にメール送信(`/server/send-mail.js`)

ログ`/_batchjob/{ジョブ名}/{ジョブ実行時刻(yyyyMMddHHmm)}のエントリ`
`title`にジョブ実行ステータス `subtitle`にPod名

ジョブ管理ステータス
waiting : 実行待ち プロパティの設定を削除でキャンセル可
running : 実行中 キャンセル不可
succeeded : 成功
failed : 失敗

### `/_settings/propertiesエントリーのrights`にサーバサイドJSのタイムアウト設定
productionサービスのみ有効 それ以外と、デフォルト:300秒
APサーバからの実行の場合: `_javascript.exectimeout={タイムアウト秒}`
バッチジョブ実行の場合: `_javascript.batchjobtimeout={タイムアウト秒}`