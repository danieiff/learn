HTTPステータスとメッセージ

ステータスコード	メッセージ	意味	解説
200	OK.	成功	処理が正しく実行された
201	Created.	生成	リソースが新しく生成された
202	Accepted.	受付	async処理の場合、またはdeleteserviceの戻り値
204	No entry.	コンテンツなし	リソースがなかった
206	Partial Content.	部分的内容	返された結果が一部である
400	Request object is invalid.	リクエスト不正	不正なリクエストが送信された
401	Authentication error.	認証エラー	認証に失敗
403	Access denied.	認可エラー	認証は成功しているが認可でエラー
404	No entry.	不存在	コンテンツが見つからなかった
405	Method Not Allowed.	不許可	productionサービスにおいてhttps以外でアクセスしてきた場合。またはstagingサービスにおいてhttp以外でアクセスしてきた場合
406	Authentication time out.	認証タイムアウト	認証タイムアウトが発生した
409	Conflict	競合発生	キー重複、もしくは楽観的ロック失敗
412	The signature is invalid.	署名検証エラー	署名の検証において失敗した（署名が不正）
413	Payload Too Large.	リクエストサイズエラー	リクエストデータのサイズ超過
417	Request security error.	リクエストセキュリティエラー	XMLHttpRequestからのリクエストではないがJSONで出力しようとしている
424	Not in service.	サービスを利用不可	サービスを利用できないかサーバサイドJavaScriptでエラーが発生した
426	Upgrade Required.	設定不正	サービスでの設定内容が不正
500	INTERNAL_SERVER_ERROR	内部サーバーエラー	サーバにおける致命的エラー
400エラー詳細

メッセージ	意味
XX is required.	XXの指定が必要
XX is not available.	XXが使えない
XX does not exist.	XXが存在しない
XX is invalid.	XXが不正
Allocate id must be a numeric value.	正しい数値がIDに指定されていない
Callback strings must use alphanumeric characters.	callbackには英数字以外使用不可
Duplicated Link self.	Link selfが重複している
Duplicated rules for ACLs.	既に同じ権限が設定されている
Duplicated URIs for	URIが重複している
Forbidden request to this service.	このサービスへの許可されないリクエスト
Max must be greater than min.	最大値が最小値より大きい値ではない
Must specify a 'E'(External) control.	E権限を指定する必要がある
Not allowed to cancel the process.	プロセスをキャンセルできない
Not allowed to use an alias for bulkcopy.	bulkcopyではaliasは使えない
Optimistic locking failed for the specified template.	指定したテンプレートの更新エラー（楽観的排他エラー）が発生
Password must be contain at least 8 characters, including at least 1 number and includes both lower and uppercase letters.	passwordは1文字以上で数字と小文字と大文字混じりである必要がある
Request format is invalid: XX	リクエストのフォーマットが正しくセットされていない
Revision number must be a numeric value.	リビジョンが数字ではない
Specified value is out of range.	リビジョンの値が範囲外
Specified URI does not match the id nor key.	指定したURIがIDとKeyに一致しない
The first limit must be less than limit(XX).	first limitはlimit(XX)以下を指定しなければならない
The first limit must be more than 0.	first limitは0以上を指定しなければならない
The number of pages must be more than 0.	number of pagesは0以上を指定しなければならない
Too many entities.	entityの数が多すぎる
Unauthorized request to modify the auth.	Authの変更リクエストは受け付けられない
URI must not contain any prohibited characters.	URIに許可していない文字の使用は不可
URI must not contain any white-space characters.	URIにblank文字は使えない
URI must start with a slash.	URIは/から始まるものでなければならない
Accesskey and Accesstoken can not be used.	AccesskeyとAccesstokenが使えない
Please set only one key.	selfは1エントリ1件のみ
Please make a pagination index in advance.	先にpagination indexを作成する必要がある
Session is disabled.	セッションが無効になっている
Session does not exist.	セッションが存在しない
Top entry can not be specified.	ルートエントリは指定不可
Forbidden request to this service.	このサービスで実行できない
Service init entry is nothing.	サービス初期化エントリが存在しない
.js' is not found.	.jsファイルが見つからない
Service does not exist.	サービスが存在しない
The Web Application has not been activated.	Webアプリケーションが有効になっていない
401エラー詳細

メッセージ	意味
Authentication is locked.	認証がロックされている
Authentication time out.	認証タイムアウト
Remote access is not allowed.	リモートからのアクセスは禁止
Captcha required at next login.	次回からCaptcha認証が必要
409エラー詳細

メッセージ	意味
Duplicated primary key.	Keyが重複している
Alias is duplicated.	aliasが重複している
User is already registered.	ユーザが既に登録されている
Optimistic locking failed.	更新エラー(楽観的排他エラー)