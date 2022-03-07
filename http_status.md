### レスポンスHTTPステータス
200  OK.
201  Created.
202  Accepted.  async処理の場合、またはdeleteserviceの戻り値
204  No entry.  リソースがなかった
206  Partial Content.  返された結果が一部である
400  Request object is invalid.
     XX is required.
     XX is not available.
     XX does not exist.
     XX is invalid.
     Allocate id must be a numeric value.  正しい数値がIDに指定されていない
     Callback strings must use alphanumeric characters.  callbackには英数字以外使用不可
     Duplicated Link self.
     Duplicated rules for ACLs.
     Duplicated rules for URIs.
     Forbidden request to this service.
     Max must be greater than min.
     Must specify a 'E'(External) control.  E権限を指定する必要がある
     Not allowed to cancel the process.
     Not allowed to use an alias for bulkcopy.
     Optimistic locking failed for the specified template.
     Password must be contain at least 8 characters, including at least 1 number and includes both lower and uppercase letters.
     Request format is invalid: XX
     Revision number must be a numeric value.
     Specified value is out of range.
     Specified URI does not match the id nor key.
     The first limit must be less than limit(XX).  first limitはlimit(XX)以下を指定
     The first limit must be more than 0.  first limitは0以上を指定
     The number of pages must be more than 0.  number of pagesは0以上を指定
     Too many entities.
     Unauthorized request to modify the auth.  Authの変更リクエストは受け付けられない
     URI must not contain any prohibited characters.
     URI must not contain any white-space characters.
     URI must start with a slash.
     Accesskey and Accesstoken can not be used.
     Please set only one key.  selfは1エントリ1件のみ
     Please make a pagination index in advance.
     Session is disabled.
     Session does not exist.
     Top entry can not be specified.  ルートエントリは指定不可
     Service init entry is nothing.  サービス初期化エントリが存在しない
     '.js' is not found.  .jsファイルが見つからない
     Service does not exist.  サービスが存在しない
     The Web Application has not been activated.  Webアプリケーションが有効になっていない
401  Authentication error.
     Authentication is locked.
     Authentication time out.
     Remote access is not allowed.  リモートからのアクセスは禁止
     Captcha equired at next login.  次回からCaptcha認証が必要
403  Access denied.  認証は成功しているが認可でエラー
404  No entry.  コンテンツが見つからなかった
405  Method Not Allowed.  productionサービスにhttpでまたはstagingサービスにhttpsでアクセスした場合
406  Authentication time out.
409  Conflict  キー重複、もしくは楽観的ロック失敗
     Duplicated primary key.
     Alias is duplicated.
     User is already registered.
     Optimistic locking failed.
412  The signature is invalid.  署名の検証において失敗した（署名が不正）
413  Payload Too Large.
417  Request security error.  XMLHttpRequestからのリクエストではないがJSONで出力しようとしている
424  Not in service.  サービスを利用できないかサーバサイドJavaScriptでエラー
426  Upgrade Required.  サービスでの設定内容が不正
500  INTERNAL_SERVER_ERROR  サーバにおける致命的エラー
