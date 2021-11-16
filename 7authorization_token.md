認証キーとトークン

アクセストークン

アクセストークンは時間制限なしの認証トークンであり、スマホアプリからの認証の他、サービスデプロイ時の認証トークンとしても使われます。

ログイン後、GET /d/?_accesstoken で取得できます。 feed.titleにアクセストークンが入ったものが返ります。

<feed>
  <title>{Accesstoken}</title>
</feed>
リクエスト時にAccesstokenをリクエストヘッダに付与することで認証されます。
認証が成功してもログイン状態にはなりません。

Authorization : Token {Accesstoken}
リンクトークン

リンクトークンはアクセストークンと同様に時間制限なしの認証トークンですが、アクセスできるURLに制限が付けられています。
　これは、メールに含まれるURLリンクとして使うことを想定しています。送信するメールの本文に以下のように${LINK=...}を挿入することで、Linktokenを含むURLが自動的に組み立てられます。

挿入文

${LINK=/setpass.html}&value=abc
実際のメール本文

https://test.vte.cx/setpass.html?_token=xxx&value=abc
URLリンク(上記Linktoken)をクリックするとsetpass.htmlが表示されます。
ただし、ログイン状態にはなりません。
Keyを /foo と指定した場合、 許可される操作は以下のみです。

/fooのエントリ検索、フィード検索が可能
/foo 配下のエントリをPOST可能(自動採番）
/foo エントリーをPOST、PUT、DELETE可能
また、リンクトークンは、ログイン後、GET ?_linktoken={Key1[,Key2],・・} をリクエストすることでも取得できます。 KeyにはURLのPathinfoを指定します。カンマで区切ることで複数指定できます。Keyに含まれる#はuidに変換されます。

アクセスキー

アクセスキーは、アクセストークンやリンクトークンを発行するために使用されるシークレットキーであり、サーバ内(/_user/{uid}/accesskeyエントリ)に保持しています。
　アクセスキーを更新することで、これまで発行したアクセストークンやリンクトークンを無効にすることができます。つまり、アクセストークンが悪意のある第三者に漏洩してしまった場合、そのアクセストークンに認可されているあらゆる操作が永久に実行可能になるため、アクセスキーを更新してこれを防ぐ必要があります。

PUT /d/?_accesskeyでアクセスキーを更新します。更新するとこれまで使っていたアクセストークンやリンクトークンは使えなくなります。

ワンタイムトークン(RXID)

ワンタイムトークン(RXID)は鍵付きハッシュを利用した認証トークンです。ワンタイムであり一度認証が実行されると同じものはもう使えません。これは、AndroidやiPhoneなどのスマホのログイン認証で使うことを想定しています。また、異なるサービス間で通信が必要になった場合にも使われることがあります。
トークン生成にはユーザアカウント、パスワード、APIキー(後述)、サービス名を使用します。ハッシュ化された文字列なのでネットワーク上で生のパスワードが流れる心配はありません。

ログイン後、GET /d/?_getrxidを実行することでRXIDを取得できます。
RXIDは、 GET /d/?_RXID={RXID文字列}で認証されます。認証後はログイン状態になります。また、以下のようにリクエストヘッダにつけて認証することもできます。

Authorization: RXID {RXIDトークン}
RXIDの有効時間や実行可能回数は、設定ファイル(/_settings/propertiesのrightsタグ)に指定します。

_rxid.minute : 有効時間(分)。[デフォルト15分]
_rxid.counter.連番.回数 : 同じRXIDを使用しても指定回数まで許可されるURLパターンを指定
_rxid.minute=60
_rxid.counter.1.10000=^/_html/foo.html.*$
APIキー

APIキーはワンタイムトークン(RXID)などに使用されるクライアントシークレットキーです。また、サーバサイドJavaScriptにおいてサービスを跨ぐAPI実行の際にもAPIキーが必要になります。サービスに対してAPIキーを１つ発行します。

APIキーを更新したい場合は以下を実行します。サービス管理者が実行できます。

PUT /d/?_apikey

APIキーを更新すると、これを保持している全てのクライアントから認証ができなくなります。第三者に漏洩してしまった場合などはAPIキーを更新することで悪意のある操作を防ぐことができます。ただし、更新した場合は新しいAPIキーをクライアントや他のサービスに配布する必要があります
　APIキーを更新してもアクセストークンやリンクトークンには影響はありません。これらを無効にしたい場合はアクセスキーを更新してください。

スマホアプリからのログイン方法

スマホアプリからログインするにはRXIDを使います。
RXIDを生成するライブラリであるvtecxauthパッケージをnpmで公開しています。まず、nodeをインストールし、npm install vtecxauthでvtecxauthパッケージをインストールしてください。 vtecxauthパッケージの vtecxauth.getRXID()メソッドを実行することでRXIDを取得することができます。
パラメータには、ユーザアカウント、パスワード、サービス名、APIキーを指定します。APIキーは管理画面で確認できます。

vtecxauth.getRXID(username: string, password: string, servicename: string, apikey: string): string;

以下はRXIDを使った認証の例です。初回はRXIDで認証してcookieを保存し、2回目以降はcookieを使って認証してください。（サーバではセッションが生成されています）
セッションが不要な場合はcookieの代わりにアクセストークンを使用してください。アクセストークンを使う場合はセッションは生成されずタイムアウトもありません。

// 初回(RXIDでログイン)
const rxid = vtecxauth.getRXID(username, password, servicename, apikey)

axios({
    url: 'http://{サービス名}.vte.cx/d',
    method: 'get',
    headers: {
        'Authorization: RXID '+ rxid,
        'X-Requested-With': 'XMLHttpRequest'
    }
}).then((result) => {
    cookie = result.headers['set-cookie'][0].split(';')[0]  // cookieを保存
}).catch((error) => {
    ・・・
})

// ２回目以降(cookie認証)
axios({
    url: 'http://{サービス名}.vte.cx/d',
    method: 'post',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': cookie
    },
    data : reqdata
}).then((result) => {
    ・・・
}).catch((error) => {
    ・・・
})