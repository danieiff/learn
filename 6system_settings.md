### システムフォルダ
- `/_group`： システムグループ
- `/_user`： ユーザエントリ
- `/_html`： HTML、CSSやJavaScript、画像など Webサーバのrewrite機能により`/`にマッピングされる
- `/_settings`：各種設定 管理画面の「メール・詳細設定」でも設定できる
  - `/properties`：各種プロパティ　システムがデフォルト値を保持しています。
  - `/template`：エントリスキーマやIndex、項目ACLなど
  - `/bigquery.json`：BigQuery用サービスアカウント秘密鍵ファイル
  - `/adduser`：ユーザ登録時(?_adduser)に送られるメール本文
  - `/passreset`：パスワードリセット時(?_passreset)に送られるメール本文
- `/_log`：ログが降順(最新が先頭） `updated` : 更新日時、`title` : タイトル、`subtitle` : サブタイトル、`summary` : 内容
- `/_security`：認証の失敗回数 DoS攻撃対策のIP Blacklistに使われる

#### プロパティ情報
`/_settings/propertiesのrightsタグ`において以下を追記して設定できます。
RXIDの詳細については「認証キーとトークン」を参照してください。

`_entry.number.default=100` : エントリーGETのデフォルト最大数[100]
`_rxid.minute` : RXID(WSSE)有効時間[120]分
`_rxid.counter.{連番}.{回数}` : 同じRXIDを使用しても指定回数まで許可されるURLパターンを指定。
`_session.minute=30` : [30]分セッション有効
#### アクセス時エラー発生でリダイレクトする
リダイレクトする際に、`Cookie`の`ERROR_STATUS`にHTTPステータスコードと`ERROR_MESSAGE`にエラーメッセージがセット Cookieは10秒間だけ有効
`_errorpage.{適用順}.{エラーページselfid}={PathInfoの正規表現}` : エラー画面表示URLパターン(正規表現)
リダイレクト例:confirm.html≠>error.html それ以外の場所≠>login.html
```
_errorpage.1.error.html=^/_html/confirm.html$`
_errorpage.2.login.html=^/_html/.*$`
```