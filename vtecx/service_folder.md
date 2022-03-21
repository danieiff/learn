### システムフォルダ
/_group： システムグループ
/_user： ユーザエントリ
/_html： HTML、CSSやJavaScript、画像など Webサーバにより{http~.vte.cx}/にマッピングされる
/_settings：  リポジトリ/setup/_settings配下のxmlファイルと対応 これを編集(注意 余計な改行を入れない), npm run upload, download サービス管理画面から設定できる
  /properties： 各種プロパティ　システムがデフォルト値を保持しています。
  /template： エントリスキーマやIndex、項目ACLなど
  /bigquery.json： BigQuery用サービスアカウント秘密鍵ファイル
  /adduser： ユーザ登録時(?_adduser)に送られるメール本文
  /passreset： パスワードリセット時(?_passreset)に送られるメール本文
/_log：ログが降順(最新が先頭） `updated` : 更新日時、`title` : タイトル、`subtitle` : サブタイトル、`summary` : 内容
/_security： 認証の失敗回数 DoS攻撃対策のIP Blacklistに使われる

#### アクセス時エラー発生でリダイレクトする
リダイレクト時、`Cookie`の`ERROR_STATUS`にHTTPステータスコードと`ERROR_MESSAGE`にエラーメッセージがセット Cookieは10秒間だけ有効
`_errorpage.{適用順}.{エラーページ.html}={絶対パス 正規表現}`
