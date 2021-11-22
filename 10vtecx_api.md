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
adduserByAdmin(feed: any): any	管理者権限でユーザを追加する
採番

メソッド	説明
採番カウンタ操作

メソッド	説明
setids(url: string, num: number): void	urlの採番カウンタをnumにセットする
addids(url: string, num: number): any	urlの採番カウンタの値を加算(+num)する
rangeids(url: string, range: string): void	uriの採番カウンタに範囲を指定する(value=start-end)
レスポンス関連

メソッド	説明
RXID(): string	RXIDを取得する
XLS出力

メソッド	説明
toXls(data: any, inputxls: string, outfilename: string): void	XLSを出力する

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