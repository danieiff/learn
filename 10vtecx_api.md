vtecxapiメソッド一覧

vtecxapiのメソッドには以下のようなものがあります。

リクエスト情報取得

メソッド	説明
getRequest(): any	リクエストオブジェクト(feed.entry[0] ～ feed.entry[n])を取得する
getPathinfo(): string	PATHINFO(リクエストURLのパス）を取得する
getQueryString(param?: string): string	URLパラメータ(クエリストリング)を取得する
httpmethod(): string	HTTPメソッド(GET,POST,PUT,DELETE)を取得する
getUriAndQueryString(): string	PATHINFO+クエリストリングを取得する
getContentType(): string	Content Typeを取得する
getHeaders(): any	リクエストヘッダを取得する
getCookies(): any	Cookieを取得する
getHeaders(): any	リクエストヘッダを取得する
uid(): number	uidを取得する
getSettingValue(key: string): string	keyを指定してサービス設定情報を取得する
getRemoteIP(): string	送信元のIPアドレスを取得する
データ操作

メソッド	説明
getEntry(url: string): any	Entryを取得する。キーとクエリパラメータを指定する
getFeed(url: string, force?: boolean): any	Feedを取得する。キーとクエリパラメータを指定する。rightsに文字列がある場合、次ページ(nextpagelink)が存在することを示す。p={nextpagelink}で次ページを取得できる。forceがtrueで全件取得
count(url: string): number	件数を取得する。キーとクエリパラメータを指定する
post(request: any, url: string, force?: boolean): any	親フォルダurlを指定してrequest(feed)をPOSTする。force:1000件以上登録
put(request: any, isbulk?: boolean, parallel?: boolean, async?: boolean): any	request(feed)をPUTする。isbulk:1000件以上、parallel:並列実行、async:非同期実行
deleteEntry(url: string, revision?: number): void	urlおよびrevisionのentryを削除する
deleteFolder(url: string): any	urlとその配下のentryを削除する
saveFiles(props: any): void	props(Map)に指定されたファイル名でアップロードファイルを保存する
getHtml(url: string): string	指定されたurlのHTMLを取得する
getContent(url: string): string	指定されたurlのコンテンツを取得する
getCsv(header: string[], items: string[], parent: string, skip: number, encoding: string): any	アップロードされたCSVをJSONオブジェクトに変換する
adduserByAdmin(feed: any): any	管理者権限でユーザを追加する
他サイトへのアクセス

メソッド	説明
urlfetch(url: string, method: string, reqData?: string, headers?:any): any	指定されたurlに対してHTTPメソッド(method)を実行する。戻り値は{ status、headers、data }のJSON形式
採番

メソッド	説明
allocids(url: string, num: number): any	指定された採番数(num)だけ採番する
採番カウンタ操作

メソッド	説明
setids(url: string, num: number): void	urlの採番カウンタをnumにセットする
addids(url: string, num: number): any	urlの採番カウンタの値を加算(+num)する
rangeids(url: string, range: string): void	uriの採番カウンタに範囲を指定する(value=start-end)
レスポンス関連

メソッド	説明
setStatus(status_code: number): void	レスポンスにステータスコードnumberをセットする
setHeader(name: string, value: string): void	レスポンスにレスポンスヘッダをセットする
sendRedirect(location: string): void	リダイレクトを実行する
sendError(status_code: number, message?: string): void	ステータスコードとメッセージを送信する(HTTPプロトコル)
sendMessage(status_code: number, message: string): void	ステータスコードとメッセージを送信する(JSON)
doResponse(feed: any, status_code?: number): void	feed.entry[0] ～ feed.entry[n]をレスポンスする。ステータスコードstatus_codeを指定可能
doResponseHtml(html: string): void	htmlをレスポンスする
doResponseCsv(value: string[], filename: string): void	csvファイルをレスポンスする
getStatus(): number	ステータスコードを取得する
RXID(): string	RXIDを取得する
ログ

メソッド	説明
log(message: string, title?: string, subtitle?: string): void	ログに記録する
PDF、XLS出力

メソッド	説明
toPdf(data: any, html: string, outfilename: string, baseurl?: string): void	PDFを出力する。baseurlに合成するPDFファイルを指定可
toXls(data: any, inputxls: string, outfilename: string): void	XLSを出力する
メール送受信

メソッド	説明
sendMail(entry: any, to: string[] null, cc?: string[], bcc?: string[], attachments?: string[]): void	メールを送信する
getMail(settings: any): any	メールを受信する
セッション関連

メソッド	説明
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
ページネーション

メソッド	説明
pagenation(url: string, num: number): void	ページIndexを作成する
getPage(url: string, num: number): any	num番目のページを取得する
BigQuery連携

メソッド	説明
postBQ(request: any, async: boolean, tablenames?:any): void	BigQueryに対してデータを登録する。tablenamesを指定することで異なるテーブルに登録できる。
deleteBQ(keys: string[], async: boolean, tablenames?:any): void	BigQueryのデータを削除する(論理削除)。tablenamesを指定することで異なるテーブルに登録できる。
getBQ(sql: string,parent?: string): any	BigQueryのデータを取得する。parentを指定すると実行結果はparentの子要素になる
doResponseBQcsv(sql: string,filename: string,header?: string):void	BigQueryのデータをcsvでダウンロードする。ファイル名やヘッダを指定できる。