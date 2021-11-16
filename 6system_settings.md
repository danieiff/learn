システムフォルダと各種設定

システムフォルダ

_から始まるフォルダをシステムフォルダといいます。システムフォルダはシステムが管理する特殊なフォルダであり以下の種類があります。

/_group：システムグループフォルダ
システムグループを管理します。詳細は「システムグループ」を参照してください。
/_user：ユーザフォルダ
配下にユーザを管理します。詳細は「ユーザエントリ」を参照してください。
/_html：htmlコンテンツフォルダ
配下のエントリーはHTML、CSSやJavaScript、画像などのコンテンツを格納できます。Webサーバのrewrite機能により、/_html は / にマッピングされます。
/_settings：各種設定情報
各種設定情報を管理します。詳細は「各種設定情報」を参照してください。
/_log：ログ
配下にシステムやアプリケーションによって出力されたログが降順(最新が先頭）で記録されます。
ログには、updated : 更新日時、title : タイトル、subtitle : サブタイトル、summary : 内容が書かれます。
/_security：認証の失敗回数を格納
詳しくは「DoS攻撃対策のIP Blacklist」を参照してください。
各種設定情報

vte.cxの設定情報は以下のように/_settings配下で管理されます。これらは、直接編集もできますが、管理画面の「メール・詳細設定」でも設定できます。（推奨）

/_settings/properties：プロパティ情報
/_settings/template：エントリスキーマやIndex、項目ACLなど
/_settings/bigquery.json：BigQuery用サービスアカウント秘密鍵ファイル
/_settings/adduser：ユーザ登録時(?_adduser)に送られるメール本文
/_settings/passreset：パスワードリセット時(?_passreset)に送られるメール本文
プロパティ情報

プロパティ情報(/_settings/properties)のrightsタグにおいて以下のような情報を設定できます。ここで設定されていないものについてはシステム内部で持つ設定情報がデフォルトで使用されます。RXIDの詳細については「認証キーとトークン」を参照してください。

_entry.number.default : エントリーGET時のデフォルト最大数 [100]
_rxid.minute : RXID(WSSE)有効時間(分) [120]
_rxid.counter.{連番}.{回数} : 同じRXIDを使用しても指定回数まで許可されるURLパターンを指定。
_session.minute : セッション有効時間 [30]
エラーページ設定

以下はエラーページの設定です。これは、アクセス時にエラーが発生した場合にリダイレクトするルールを設定します。
また、リダイレクトする際に、Cookieの「ERROR_STATUS」にHTTPステータスコードが、また「ERROR_MESSAGE」にエラーメッセージがセットされます。このCookieは10秒間だけ有効です。

_errorpage.{適用順}.{エラーページselfid}={PathInfoの正規表現} : エラー画面表示URLパターン(正規表現)
confirm.html表示中にエラーの場合はerror.htmlに遷移する。それ以外のエラーはlogin.htmlに遷移する設定例

_errorpage.1.error.html=^/_html/confirm.html$
_errorpage.2.login.html=^/_html/.*$
メール送信設定

以下はメール送信の設定です。これが設定されていないとユーザ登録においてメール送信ができないため本人確認ができません。ご自身でEmailを用意して設定してください。

_mail.from.personal : EMailの送信元名
_mail.from : Emailのfrom
_mail.transport.protocol : smtpsなどのメール送信プロトコル
_mail.password : メール送信アカウントのパスワード
_mail.smtp.host : メール送信ホスト
_mail.smtp.port : メール送信ポート
_mail.smtp.auth : true/false
BigQuery接続設定

以下はBigQueryに接続するための設定です。
これとは別に、/_settings/bigquery.jsonに、サービスアカウントの秘密鍵JSONを登録する必要があります。BigQueryを使用するためにはGoogle Cloud Platformプロジェクトを作成し、BigQueryを有効にする必要があります。

 _bigquery.projectid : プロジェクトID
 _bigquery.dataset : データセット名
 _bigquery.location : ロケーション(デフォルト値は asia-northeast1)
プロジェクトの作成とIDの確認

まず、Googleアカウントを取得します。
(https://accounts.google.com) のログイン画面からアカウントを作成を選択しアカウントを作成します。
1.作成したアカウントで Google Cloud Platform にログインします。(https://console.cloud.google.com)
2.プロジェクトを作成します。
　左上のGoogle Cloud Platformという題名の隣にプロジェクトの選択 ▼というリスト項目が表示されているのでクリックします。
　既に別のプロジェクトを作成し選択している場合、プロジェクト名が表示されます。
　表示された画面右上の新しいプロジェクトを選択し、新規プロジェクトを作成します。
3.プロジェクトIDの確認
　Google Cloud Platform のホーム画面に表示されるプロジェクト情報にプロジェクトIDが表示されます。

Billingの設定

BigQueryを使用するにはBillingの設定が必要です。
Google Cloud Platform の左メニューから「お支払い」を選択し、請求先アカウントを追加します。

データセットの作成

Google Cloud Platform の左メニューからBigQueryを選択すると、BigQueryの管理画面が表示されます。(https://bigquery.cloud.google.com)
BigQuery管理画面の左メニューより、プロジェクト名の横の下三角▼をクリックします。
Create new datasetを選択し、データセットを作成します。
データセットID、ロケーションを入力します。

BigQueryのサービスアカウント秘密鍵の作成

サービスアカウントとは、Googleの各サービスに対する権限を持つアカウントです。Googleのサービスに対しAPIリクエストを行う際に認証情報として使用します。
Google Cloud Platform の左メニューからIAMと管理-サービスアカウントを選択します。
画面上部のサービスアカウント表題の隣にある＋サービスアカウントを作成をクリックします。
　　1.サービスアカウント名: 任意の値を入力
　　2.Project role: BigQuery-BigQueryユーザーおよびBigQueryデータオーナーを選択
　　3.新しい秘密鍵の提供にチェックを入れます。キーのタイプをJSONとします。
　　4.保存をクリックします。
サービスアカウントが作成されます。同時に、JSON形式の秘密鍵がダウンロードされます。
