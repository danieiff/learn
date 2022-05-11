### サーバーサイドスクリプトでリソース操作
- try catchでエラーハンドリングされてエラーがないと200で、されていないとランタイムエラーが発生すると、ステータスコード400と`{ "feed": { "title": "エラー文" } }`をレスポンスする
#### リソース操作
getRequest(): any	リクエストオブジェクト(feed.entry[0] ～ feed.entry[n])を取得する
getPathinfo(): string	PATHINFO(リクエストURLのパス）を取得する
getQueryString(param?: string): string	URLパラメータ(クエリストリング)を取得する
getUriAndQueryString(): string	PATHINFO+クエリストリングを取得する
getHeaders(): any	リクエストヘッダを取得する
getCookies(): any	Cookieを取得する
getHeaders(): any	リクエストヘッダを取得する
getSettingValue(key: string): string	keyを指定してサービス設定情報を取得する
getRemoteIP(): string	送信元のIPアドレスを取得する
getStatus(): number	ステータスコードを取得する
getEntry(url: string): any	Entryを取得する。キーとクエリパラメータを指定する
getFeed(url: string, force?: boolean): any	Feedを取得する。キーとクエリパラメータを指定する。forceがtrueで全件取得
getHtml(url: string): string	指定されたurlのHTMLを取得する
count(url: string): number	件数を取得する。キーとクエリパラメータを指定する
uid(): number	uidを取得する
httpmethod(): string	HTTPメソッド(GET,POST,PUT,DELETE)を取得する

post(request: any, url: string, force?: boolean): any	親フォルダurlを指定してrequest(feed)をPOSTする。force:1000件以上登録
put(request: any, isbulk?: boolean, parallel?: boolean, async?: boolean): any	request(feed)をPUTする。isbulk:1000件以上、parallel:並列実行、async:非同期実行
deleteEntry(url: string, revision?: number): void	urlおよびrevisionのentryを削除する
deleteFolder(url: string): any	urlとその配下のentryを削除する

#### レスポンス
doResponse(feed: any, status_code: number ) フィードを返す
setStatus(status_code: number): void	レスポンスにステータスコードnumberをセットする
setHeader(name: string, value: string): void	レスポンスにレスポンスヘッダをセットする
sendRedirect(location: string): void	リダイレクトを実行する
sendError(status_code: number, message?: string): void	(HTTPプロトコル)
sendMessage(status_code: number, message: string): void	(JSON)

#### セッション
/_settings/properties で`_session.minute=30` : [デフォルト30]分セッション有効
setSessionFeed(name: string, feed: any): void	feedをセッションに登録する
setSessionEntry(name: string, entry: any): void	entryをセッションに登録する
setSessionString(name: string, str: string): void	文字列をセッションに登録する
setSessionLong(name: string, num: number): void	数値をセッションに登録する
getSessionFeed(name: string): any	セッションからfeedを取得する
getSessionEntry(name: string): any	セッションからentryを取得する
getSessionString(name: string): string	セッションから文字列(string)を取得する
getSessionLong(name: string): number	セッションから数値を取得する
deleteSessionFeed(name: string): void	セッションにあるfeedを削除する
deleteSessionEntry(name: string): void	セッションにあるentryを削除する
deleteSessionString(name: string): void	セッションにある文字列(string))を削除する
deleteSessionLong(name: string): void	セッションにある数値を削除する
incrementSession(name: string, num: number): void	セッションにある数値をnumだけ加算する
#### 他サイトのAPIを叩く
`urlfetch(url: string, method: string, reqData?: string, headers?:any): any	指定されたurlに対してHTTPリクエストを実行する。戻り値は{ status、headers、data }のJSON形式

### サービス管理画面にログ出力
- `vtecxapi.log(subtitle: string, title: string, content: string): void`
- `vtecxapi.log(title: string, content: string): void`
- `vtecxapi.log(content: string): void`
オブジェクトや配列は`JSON.stringify()`
### セキュリティ
- ブラウザでのユーザー入力等をSQL等に含めるとき特殊文字をエスケープする
### SSR
ブラウザから/s/ssr.htmlを表示できる
```tsx: src/server/ssr.html.tsx
import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

const element = <h3> Hello, World! </h3>
const html = ReactDOMServer.renderToStaticMarkup(element)
vtecxapi.doResponseHtml(html)
```
### バッチジョブ
`/_settings/propertiesエントリーのrights`に以下を記述
`_batchjob.{ジョブ名}={分} {時} {日} {月} {曜日} {サーバサイドJS名}`
- {ジョブ名}はサービス内で一意とする。(重複分のジョブは取得されず実行されない。)
- {分} {時} {日} {月} {曜日}の部分はlinuxのcrontabコマンドと同じ指定方法。
- {サーバサイドJS名}はリクエストで/s/の後に指定する値。(/_html/server/ 拡張子を含まない。)
例`_batchjob.sendmail=30 8 * * * send-mail` 毎朝8:30にメール送信(`/server/send-mail.js`)

ログ`/_batchjob/{ジョブ名}/{ジョブ実行時刻(yyyyMMddHHmm)}のエントリ`
`title`にジョブ実行ステータス `subtitle`にPod名

ジョブ管理ステータス waiting : プロパティの設定を削除でキャンセル可 running succeeded failed

### `/_settings/properties.xml rights`にサーバサイドJSのタイムアウト設定
productionサービスのみ有効 デフォルト: 300秒
サーバー内実行時間: `_javascript.exectimeout={タイムアウト秒}`
バッチジョブ実行時間: `_javascript.batchjobtimeout={タイムアウト秒}`
