#### REST API -[*4.リソース管理とメタ情報*](https://vte.cx/documentation.html#index04)
`GET /d/?_service` ログインしているサービス名取得
`GET /d/foo` リソースfoo取得
`GET /d/foo`-エンドポイントURL
`GET /d/foo/bar`: 配下にリソースをネストできる [*1]()
`GET /d/foo?f`: 配下にあるリソース一覧
:::details e: メタ情報
vte.cxにおけるリソースのメタ情報はATOM形式
JSONのレスポンス
```
[
  {
    "wakuwaku": "テスト内容",
    "author": [ { "uri": "urn:vte.cx:created:209" } ],
    "id": "/foo,1",
    "link": [ { "___href": "/foo", "___rel": "self" } ],
    "published": "2018-06-26T12:29:37.947+09:00",
    "updated": "2018-06-26T12:29:37.947+09:00"
  }
]
```
ATOM項目
entry: リソースの最小単位であり、1件のリソースが1エントリになります。
feed: 中に複数のentryがリスト形式で入る形になります。(JSONではfeed、entryは省略されます）
author: uri属性に「urn:vte.cx:updated:{uid}」が代入される。(uidは更新者のユーザ識別子)
id: キーとリビジョンを組み合わせた形でシステムで一意となる(後述)
published、updated : 作成(更新)日時を「yyyy-MM-dd'T'hh:mm:ss.SSS+99:99」(ISO8601拡張)形式で代入される
content: コンテンツ(リソース本体)の格納場所として使われます。
link: 別名(alias)や外部コンテンツのキー([*2](以下の説明))として使われます。
contributor: アクセス権限(ACL)を管理するために使われます。
rights: 設定情報などで使われます。この項目は暗号化されます。
author、id、published、updatedなどは自動で値がセットされますが、title、subtitle、summary等の内容はユーザによって自由にセット可能です。
wakuwaku: エントリスキーマによるユーザ定義項目 [*5](エントリスキーマとユーザ定義項目)
:::
エラーコード: 204 No entry. コンテンツが見つからなかった
`PUT /d/foo?_content` テキストやblobを格納
ペイロード(リクエストのBody): raw形式、最大100MiB
Content-Type: ~multipart/form-data~ image/pngやtext/htmlなど実際に格納したコンテンツに合ったタイプを指定
?_contentパラメータを付けない場合: メタ情報の登録更新になります。[*3](メタ情報とATOM表現)
 [FormData](https://developer.mozilla.org/ja/docs/Web/API/FormData)を使って画像やCSVファイルをアップロードすることができます。[*4](ファイルアップロード)
 vte.cxの別ドメインからのアクセスへのセキュリティ対策としてPUTのリクエストヘッダにX-Requested-With: XMLHttpRequestを設定する
 エラーコード: 417 Request security error. XMLHttpRequestからのリクエストではないがJSONで出力しようとしている

エントリの項目
id: エントリは一つの<id>タグを持ちます。これは、システム全体で一意となるように、キーとリビジョンを組み合わせた形をしています。(上記エントリのidは、/foo,1) また、リビジョンはエントリの更新回数です。
idが同じということはそのエントリのデータが完全に同一であることを意味します。
エントリを登録すると、<id>タグに値を自動的に登録します。
エントリ更新時、idが存在すると楽観的排他チェックを行います。つまり、更新前の元のリビジョンと比較して値が異なれば既に更新されているとみなされ楽観的排他エラーとなります。ただし、更新するエントリにidが含まれていない場合は楽観的排他チェックを行いません。
エントリ削除時、指定されたリビジョンと更新前のものを比較することで楽観的排他チェックを行います。リビジョン指定が省略された場合はチェックを行いません。
link: <link>タグのrel="self"属性のhref属性がエントリの参照を表すキーです。
キーは「/path/to」のようなパス形式となります。階層は10階層まで持つことができ、子は無限に持つことができます。
キーには基本的に取得した際に指定したURLと同じものになりますが、別名キー(alias)で取得するとidとは異なるキーの値となります。
キーに含まれる名前には英数字と$、_(アンダースコア)が使えます。

rel: エントリにlink rel=alternateタグを付与することで別のURLにマッピング 最大10個
:::details
実体が /foo/android で別名(alias)が /bar/android
[
  {
    "id": "/foo/android,1",
    "link": [
      {
        "___href": "/foo/android",
        "___rel": "self"
      },
      {
          "___href": "/bar/android",
          "___rel": "alternate"
      }
    ]
  }
]
:::
`PUT /d?_addalias`
```
<feed>
  <entry>
    <link rel="self" href="{キー}" />
    <link rel="alternate" href="{alias}" />
  </entry>
</feed>
```
`PUT /d?_removealias` で指定したaliasを削除

メタ情報は、JSONの他にもXMLやMessagePackなどの様々な形式に変換して取りだすことができます。例えば、GET /d/foo?e&xとxパラメータを付与することでXMLとして取得でき、GET /d/foo?e&mなどmパラメータでMessagePackとして取得できます。どのような形式に変換されても項目の構造は同じ形になります。 デフォルトはJSON形式
ブラウザに表示する際は、JSONやMessagePackではなくXMLをおすすめします。なお、JSONについてはセキュリティー上の理由でブラウザに直接表示できないようにしています。（JSONPの禁止）
また、POSTやPUTのペイロード(リクエストのBody)はraw形式のみ許可しています。送信する際はXHR通信(XMLHttpRequest)である必要があります。フォームデータ(HTML Form)送信はCSRF対策のため受け付けない

リクエストパラメータの種類とContent-Type
リクエストパラメータの予約語は１文字の英字、もしくは先頭 _(アンダースコア)で始まる文字列になります。これ以外のもの、つまり２文字以上で_で始まらない文字列についてはユーザのアプリケーションが自由に使えるパラメータです。

x : XML文字列 (Content-Type : text/xml)
m : MessagePack形式バイナリをDeflate圧縮 (Content-Type : application/x-msgpack)
リクエストヘッダに「Content-Encoding: deflate」があればリクエストデータは圧縮されていることを示します。
リクエストヘッダに「Accept-Encoding: deflate」があればレスポンスデータを圧縮します。
上記パラメータが無い場合はJSON文字列 (Content-Type : application/json)
JSON文字列返却はXHR通信からのみ受け付けるようにしているため、リクエストヘッダに「X-Requested-With: XMLHttpRequest」が設定されていなければエラーを返却します。(ステータス417)
以下は、/foo配下をxmlで取得した例です。
http://{サービス名}.vte.cx/d/foo?f&x
```
<?xml version="1.0" encoding="UTF-8" ?>
<feed>
    <entry>
        <wakuwaku>テスト内容</wakuwaku>
        <author>
            <uri>urn:vte.cx:created:209</uri>
        </author>
        <id>/foo/bar,1</id>
        <link href="/foo/bar" rel="self"/>
        <published>2018-06-26T12:29:37.947+09:00</published>
        <updated>2018-06-26T12:29:37.947+09:00</updated>
    </entry>
</feed>
```