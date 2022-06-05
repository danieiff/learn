エラー feed.titleにエラーメッセージ
パス10階層まで、英数字$_可
## リソース
リソース:エントリ = 1:1
システム/ユーザーによって特定の役割が与えられる
### ATOM項目
feed: [{エントリ}, {エントリ}, ...]
  entry: { 以下のプロパティ }
    author: uri属性に「urn:vte.cx:updated:{uid}」が代入される。(uidは更新者のユーザ識別子)
    id: `/{リソースの絶対パス KEY},{エントリ更新回数 REVISION}` サービスで一意、自動生成 エントリをエントリ更新,削除時にidを指定すると、楽観的排他チェックできる
    published、updated: yyyy-MM-dd'T'hh:mm:ss.SSS+99:99(ISO8601拡張)
    content: コンテンツ(リソース本体)の格納場所として使われます。
    link: `[{___rel: 'self', ___link: '{KEY}'}, {___rel: 'alternate', ___link: '{KEY}'}, ...]`(JSON形式) self エントリ自身の参照絶対パス a lias マッピングされた別の絶対パス 最大10
    contributor: アクセス権限(ACL)を管理するために使われます。
    rights: 設定情報などで使われます。この項目は暗号化されます。
    title, subtitle, summary, その他: エントリに与えられた役割によって異なる
### ユーザー定義項目
管理画面の「エントリスキーマ管理」編集 → `npm run download:template`
/setup/_settings/template.xmlを編集 システム運用中は追加項目は常に要素の最後尾に追記する

データ登録更新時に検証される
- ATOM項目に重複しない
- 型名先頭 not case sensitive
- 項目名 ２文字以上１２８文字以下の英数字および一部の記号(_や$) 数字で始まるものやハイフンは使用不可

```xml:/_settings/template.xml
// 略
<content>idx // string 最大10MiB それ以上はコンテンツとして扱う  デフォルト
email
verified_email(Boolean) // Boolean型
name
birth(date) // yyyy-MM-dd HH:mm:ss.SSS{タイムゾーン([ISO 8601] +99:99、+9999、+99)} "-" → "/"or"" , " " → "T"or"" , ":" → "" , "." → "" , "HH"以降任意
given_name
family_name
error
 errors{2} 　　　　　　// インデントでerrorの子要素。{}中は要素数の最大値 デフォルト1
  domain
  reason
  message
  locationType
  locationType_desc(desc) // 当項目で{降順ソートされる兄弟項目名}_desc(desc)
  location
 code(int){1~100}       // 1~100の範囲 (int){範囲, 最大値} (string){最大文字数}
 message
subInfo
 favorite
  $attribute       // $で始まる項目はXMLの属性となる（兄弟項目の先頭に記述する）
  food!=^.{3}$     // !→必須項目 {}の後
  music=^.{5}$     // https://docs.oracle.com/javase/jp/7/api/java/util/regex/Pattern.html
 favorite2
  food
   food1
 favorite3
  food
 hobby{}
  $$text</content>     // $$textはXMLのテキストノードになる 自身の要素に値が代入される
// 略
```
2エントリが入ったフィード 例
```json
[
  {
    "email": "email1",
    "family_name": "管理者Y",
    "given_name": "X",
    "name": "管理者",
    "subInfo": {
      "favorite": {
        "food": "カレー",
        "music": "ポップス1"
      }
    },
    "verified_email": false
  }, {
    "error": {
      "code": 400,
      "errors": [
        {
          "domain": "vte.cx",
          "location": "Authorization",
          "locationType": "header",
          "message": "invalid header",
          "reason": "invalidAuthentication"
        }
      ],
      "message": "Syntax Error"
    }
  }
]
```

リクエストパラメータ f 配下のエントリ全て
http://{サービス名}.vte.cx/d/foo?f

## GET
前回参照したコンテンツに更新がなければ304 Not Modifiedステータス
リクエストパラメータ (予約語:１文字, _で始まる) で条件指定
GET {KEY途中まで}* {KEYの途中まで}にマッチするエントリのフィード
### リソースの種類
f 配下エントリ デフォルトでKEYの昇順
e エントリ
l l={LIMIT} エントリ{LIMIT}件 デフォルト100(/_settings/properties.xml rightsタグで設定 _entry.number.default=100`)
c 配下のエントリ件数
### Content-Type
http://{サービス名}.vte.cx/d/foo?f&x ←'x'で、リクエストデータが Content-Type : text/xml で返る。 ブラウザにリクエストデータを直接表示できる
デフォルトで Content-Type : text/json でのリクエスト リクエストヘッダに X-Requested-With: XMLHttpRequest が設定されていなければ417エラー
###　Pagination
↓リクエスト 同じ条件パラメータを指定
_pagination=[{ページ範囲開始},] {ページ範囲} カーソル一覧を作成 開始のデフォルトは1
n={ページ数} カーソル外ページを指定すると400: Please make a pagination index in advance
### Feed検索
検索indexをできるだけ使う
#### 検索条件指定文字列
{エントリ項目名(階層は.で繋ぐ)}-{検索条件指定文字列}-{encodeURIComponent(値)}
eq
lt <
le <=
gt >
ge >=
ne !  =
rg 正規表現 (あいまい検索 *{値}.*)
fm 先頭が値に一致
bm 末尾が値に一致
ft 全文検索 {エントリ項目名}を|で繋ぐと複数項目が検索対象(全文検索Index設定必要) 値を,で繋いでAND条件にできる
asc 昇順ソート {項目名}-asc s={項目名} 検索indexが設定されていると、デフォルトでその項目,KEYで昇順になる
desc 降順ソート {項目名}-desc (インメモリソート) s={desc型としてテンプレートスキーマ定義、検索Index設定された、{降順ソートしたい項目}_desc (エントリに現れない)} (Index利用)

#### OR検索
&|({条件1}&)&|({条件2}&)
()の中はAND条件のみ
OR条件の外の条件はOR条件に分配される

#### Indexの設定
Index検索を適用できるのは検索条件の最初の項目(一番左の項目)のみ。２番目以降はIndex検索後にメモリ内で検索を実行
gt, ge, lt, le, eq, fm,
暗号化項目は指定不可。
２つ目以降の検索条件はあいまい検索や暗号化項目の検索が可能
Indexは検索パフォーマンスを向上させる一方、書込パフォーマンスを悪化させるため、必要最低限

{KEY}から{エントリ項目}を検索するときにIndex検索する
　/_settings/template.xml のrightsタグ（か管理画面のエントリスキーマ管理）
{エントリ項目(階層は.で繋ぐ)}:{KEY(正規表現) |で繋いで複数指定}
#### 全文検索Index
↑:を;に変えると全文検索Index
左辺で、エントリ項目を|で繋ぐとOR条件
全文検索Indexの左辺(;の左)と、リクエストパラメータの検索条件は完全一致させる
### DISTKEY検索
↑:を::にするとDISTKEY 他2つインデックスと重複設定できない
eq条件のみ検索可能
{フォルダ}?{DISTKEY項目}={値}&{インデックス|全文検索インデックス項目の条件}{&インメモリ検索条件 ...}
#### ソート
OR検索の場合 デフォルトでOR検索条件ごとにソート
OR検索内のソート項目は、OR検索内の第一条件がインデックス指定であればインデックス項目の昇順
インデックス項目でない場合 keyの昇順

## PUT (vtecxapi.putにも適用)
ペイロード(リクエストのBody): raw形式100MiBまで　それ以上はBlob
登録先 エントリのKEY link rel=selfタグのhref属性の値 親階層がないとエラー
同時登録更新 最大1000エントリ
成功 HTTPステータスが200(登録時は201)

楽観的排他チェックを行う場合GETで取得したエントリのidをそのまま指定
登録、更新すると自動的にidがインクリメント　idを省略すると楽観的排他チェックは行われず強制上書き

エントリの部分更新
第一階層の項目に値が代入されているものを丸ごと置き換え
第二階層以下の項目が省略されている場合は更新されない 上書きで消したい場合は空白を代入
link項目 rel属性の単位で設定されているものを置き換え

PUTするエントリのうち、id項目が↓になっているものが削除される
`id: '{前のID(任意)}?_delete'` 前のIDがあれば楽観的排他チェック

エイリアスの追加と削除
```ts
const handleAlias = (key_self: string, key_alias: string) => {
  const data = [
    {
      // id,
      link: [
        { ___rel: 'self', ___href: key_self },
        { ___rel: 'alternate', ___href: key_alias },
      ],
    },
  ]
  // PUT /d?_addalias data
  // PUT /d?_removealias data
}
```
id項目を削除用にして PUT [{link: [{ ___rel: 'self', ___href: '{ALIAS}' }] でもエイリアス削除

### 大量更新
1000件以上の更新
内部で1000件ずつ分割して実行するので一貫性は担保されない
直列 先頭のエントリから1000件ずつ実行
PUT /d/?_bulk リクエストデータにFeed (並列同期処理)
PUT /d/?_bulk&_async リクエストデータにFeed (並列非同期処理)
PUT /d/?_bulkserial リクエストデータにFeed (直列同期処理)
PUT /d/?_bulkserial&_async リクエストデータにFeed (直列非同期処理)

## DELETE
DELETE /d/{KEY} KEY配下にエントリがあるとエラー'Can't delete for the child entries exist.'
DELETE /d/{KEY}?_rf 配下のエントリを含めて削除
DELETE /d/{KEY}?r={REVISION} 楽観的排他チェック

### CLIからエントリをPUT
以下のようなJSONデータを/dataフォルダ上に作成し、npm run upload:dataを実行してください。キーであるlink.___hrefが/foo/2になっていますので、/d/foo/2に登録される (親フォルダがある前提)
sample2.json
[{
  "user": {
    "name": "bar",
    "email": "bar@vte.cx"
 },
  "link": [
      {
          "___href": "/foo/2",
          "___rel": "self"
      }
  ]
}]
ブラウザで確認 http://{サービス名}.vte.cx/d/foo?x&f

#### データのバックアップ
GET /d/{KEY}?_nometa id、author、published、updatedがついていないエントリ
↑フィードをPUT /d/?_bulkserial データをリストア

### 採番と採番カウンタ
GET|PUT /d/{KEY}?_allocids={採番数} KEY内管理されるランダム値
PUT /d/{KEY}?_setids={設定値} 採番カウンタに設定値をセット
PUT /d/{KEY}?_addids={加減数} 加算数だけカウンタ値をプラスしてその値、現在値を返す
GET /d/{KEY}?_addids 現在のカウンタ値
POST /d/{KEY}?_rangeids リクエストbodyに{START}-{END}を入れる 採番範囲 STARTからENDをループ
GET /d/{KEY}?_rangeids 設定加算枠(addids用) feed.titleに'Addids range has been set.'

vtecxapi.allocids(KEY: string, num: number): any	指定された採番数(num)だけ採番する

allocids(url: string, num: number): any 採番
setids(url: string, num: number): void	urlの採番カウンタをnumにセットする
addids(url: string, num: number): any	urlの採番カウンタの値を加算(+num)する
rangeids(url: string, range: string): void	uriの採番カウンタに範囲を指定する(value=start-end)

### システムフォルダ
/_group： システムグループ
/_user： ユーザエントリ
/_html： HTML、CSSやJavaScript、画像など Webサーバにより{http~.vte.cx}/にマッピングされる
/_settings：  リポジトリ/setup/_settings配下のxmlファイルと対応 これを編集(注意 余計な改行を入れない), npm run upload, download サービス管理画面から設定できる
  /properties： 各種プロパティ　システムがデフォルト値を保持しています。 (/properties.xmlとは別)
  /template： エントリスキーマやIndex、項目ACLなど
  /bigquery.json： BigQuery用サービスアカウント秘密鍵ファイル
  /adduser： ユーザ登録時(?_adduser)に送られるメール本文
  /passreset： パスワードリセット時(?_passreset)に送られるメール本文
/_log：ログが降順(最新が先頭） `updated` : 更新日時、`title` : タイトル、`subtitle` : サブタイトル、`summary` : 内容
/_login_history : アカウントの認証(ログイン、新規登録等)履歴
/_security： 認証の失敗回数 DoS攻撃対策のIP Blacklistに使われる

#### アクセス時エラー発生でリダイレクトする
リダイレクト時、`Cookie`の`ERROR_STATUS`にHTTPステータスコードと`ERROR_MESSAGE`にエラーメッセージがセット Cookieは10秒間だけ有効
`_errorpage.{適用順}.{エラーページ.html}={絶対パス 正規表現}`

// GET /d/?_service サービス名
// GET /{d|s}?_now サーバの現在時刻

エンドポイントを登録
管理画面からエンドポイントを作成してダウンロード folderacls.jsonを編集してアップロード
 `npm run {upload|download}:folderacls`
