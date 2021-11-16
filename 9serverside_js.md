サーバサイドJavaScript

vte.cxのアプリケーションを作成すると基本的にSPA(Single Page Application)になります。SPAのスタイルでは、サーバサイドでレンダリングするのではなく、クライアントからはAjax(XHR)を用いてサーバのAPIにアクセスし、サーバはJSONデータを返すのみとなります。サーバサイドは純粋なAPIとなり、複雑さがサーバサイドからクライアントに移動していることから、これはThin server architecture とも呼ばれます。
　しかし、ビジネスロジックをもたない純粋なREST APIだけで構築すると開発生産性やパフォーマンスを大きく損ねることがあります。あまりにもクライアント側にビジネスロジックが偏重しすぎて開発工数が膨らんでしまうのです。また、クライアントから何回もAPIを呼ぶいわゆるN+1問題も発生しがちです。
　実はクライアントよりもサーバ側でビジネスロジックを実行する方が有利であることがわかっています。つまり、クライアントはビジネスロジックを持たない単純なViewとし、Viewに必要なデータの組み立てなどはサーバ側で行うことで、クライアント側へのビジネスロジック偏重を防ぎます。こうすることで、N+1問題も解決できます。
　このスタイルを、BFF(Backend for Frontend)といいます。vte.cxではサーバサイドのBFFにもJavaScriptを採用することで、統一的(Isomorphic)な環境で高い生産性を発揮できるようにしています。
　BFFは実はフロントエンドアプリケーションの範疇になります。重要なポイントは、あくまでフロントエンドのアプリケーションとしてサーバサイドJavaScriptを実装するということであり、データベース設定や認証設定などのようなサーバ構築のための設定などではないという点です。

サーバサイドJavaScriptの設定方法と実行の仕組み

サーバサイドJavaScriptを設定する方法は簡単で、/serverフォルダ配下にJavaScriptファイルを格納するだけです。また、GET|POST|PUT /s/{スクリプト名}のようにリクエストすると、/serverフォルダに格納されている {スクリプト名}.jsファイルがサーバ上で実行されます。
　サーバサイドJavaScriptの実行時間は同期リクエストで最大５分までで、それを超えると強制的にキャンセルされます。長時間かかる場合は_asyncパラメータを付けて非同期リクエストを実行してください。非同期リクエストでは別スレッドが起動し、ステータス202 Acceptedをレスポンスします。実際の処理はバッチジョブサーバで実行されるため、バッチジョブサーバに設定されたタイムアウト時間が最大の実行時間になります。

サーバサイドJavaScriptのビルドとデプロイ

サーバサイドJavaScriptは、TypeScriptで書かれたソースコードをWebpackなどによりECMAScript5の形式に変換されたものを実行します。 これは、以下のようにビルドします。

ログイン

　管理画面にてサービスを作成後(仮にfooserviceとします）、githubのブランクプロジェクトをチェックアウトして、npm installします。その後、以下のコマンドでログインします。アカウントとパスワードはサービス作成で使ったものと同じもの使用してください。

npm run login

service:fooservice
is production?:n
login:foo@bar.com
password:*********
Logged in.
ビルドとデプロイ

　以下のコマンドを実行するとssr.html.tsxをビルド＆デプロイできます。また、ソースを更新すると自動的にビルド＆デプロイされます。デプロイ後、/s/ssr.htmlをブラウザで開いて確認してください。

npm run watch — --env entry=/server/ssr.html.tsx
クライアントコードの開発

　以下のコマンドを実行するとクライアントコードの開発環境が開きます。(webpack-dev-serverが起動します)

npm run serve:index
　ログインが必要な場合は以下でログインページを開き、ログイン後に再び上記コマンドを実行してください。

npm run serve:login
　index.tsxとは異なるファイル名(以下の例はhello.tsx)を指定する場合は以下のようにしてください。

npm run serve — --env entry=/components/hello.tsx
Reactとvtecxapiを利用してSSRを実行する

vtecxapiパッケージをインポートすることでサーバサイドJavaScriptからvte.cxのAPIを利用することができます。まず初めにnpm install vtecxapiでvtecxapiパッケージをインストールしてください。
　以下はReactの機能を使ってSSR(サーバサイドレンダリング)を実行するサンプルです。最後の行のHTMLを返却するところでvtecxapiが使われています。
　以下をデプロイして、/s/ssr.htmlにアクセスすると、「Hello, World!」が表示されるのを確認できます。

// server/ssr.html.tsx
import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

const element = (
    <h3> Hello, World! </h3>
)

const html = ReactDOMServer.renderToStaticMarkup(element)

vtecxapi.doResponseHtml(html)
vtecxapiを利用してJSONを返すサービス

vtecxapi.doResponse()により、オブジェクトをJSONなどに変換してクライアントに返すことができます。サーバサイドのビジネスロジックはこのような形でJSONを返すサービスとして実装することが多いと思われます。
以下は/fooエントリを取得してJSONを返すサンプルです。
　前述のサンプルでは、コンテンツを返すのに、doResponseHtml()を使っていましたが、JSONなどのデータを返すには、doResponse()を使います。 ちなみに、doResponse()は、リクエストパラメータにデータタイプを指定することで様々なデータ形式に変換することができます。例えば、/registration?xでxml、/registration?mでMessagePackを返すことができます。

// server/registration.tsx
import * as vtecxapi from 'vtecxapi'

const feed = vtecxapi.getFeed('/registration')   // /registration?xでxmlになる
vtecxapi.doResponse(feed)
また、vtecxapi.getFeed()は検索条件を指定して検索することができます。
検索条件の文字列に&が含まれる可能性がある場合は、encodeURIComponent()などを使って必ずエンコードしてください。レスポンスの最初のエントリのrightsに文字列(nextpagelink)が格納されている場合、次ページが存在することを示します。次のリクエストにて、p={nextpagelink}パラメータを付けることで次ページを取得できます。

// server/registration.tsx
import * as vtecxapi from 'vtecxapi'

const param = encodeURIComponent(vtecxapi.getQueryString('param'))
const feed = vtecxapi.getFeed('/registration?param='+param)   // /registration?xでxmlになる
vtecxapi.doResponse(feed)
ファイルアップロード

リソースの登録更新では、raw形式のバイナリの他にFormDataオブジェクトを使ったアップロードを行えます。FormDataオブジェクトはmultipart/form-data形式のデータであり、ブラウザから直接アップロードすることができます。
アップロードファイルが一つでありキーも指定されていない場合、アップロードしたファイル名がエントリのKeyとして登録されます。アップロードファイルが複数の場合は以下のようにサーバサイドJavaScriptを使って処理することができます。
vtecxblankに複数のファイルを登録するサンプルプログラム(upload_pictures_sample)があります。これは、クライアントから２つの画像データを送信してサーバに登録するサンプルです。
サーバサイドJavaScriptのvtecxapi.saveFiles(param)は、ファイルアップロードにおけるMultipart Postリクエストをサーバ側で処理するために使用します。具体的には、saveFiles(param)で指定するparamオブジェクトに、inputタグのnameをキーにして任意のファイル名を設定します。
サービスを作成し、デプロイしてログインすると、/upload_pictures_sample.htmlを表示できますので、そこから２つの画像ファイルをアップロードしてみてください。アップロードに成功すると、http://{サービス名}.vte.cx/{アップロードファイル名}でブラウザに表示して確認できます。（※ サービスの作成方法については、チュートリアルを参照してください。）

画面側(upload_pictures_sample.tsx)

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios, { AxiosError } from 'axios'
import {
    Form,
    FormGroup,
    FormControl,
    Button
} from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
}
/* コンポーネントのStateの型宣言 */
interface ComponentState {
    picture1: any,
    picture2: any,
    [propName: string]: any
}

class UploadPictureForm extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props)
        this.state = { picture1: {}, picture2: {} }
    }

    handleChange(e: React.FormEvent<any>) {

        if (e.currentTarget.files) {
            const file = e.currentTarget.files.item(0)
            if (file) {
                const key = '/_html/img/' + encodeURIComponent(file.name)
                const name = e.currentTarget.name

                // 画像以外は処理を停止
                if (!file.type.match('image.*')) {
                    return
                } else {
                    // 画像表示
                    let reader = new FileReader()
                    reader.onload = () => {
                        this.setState({ [name]: { value: reader.result, key: key } })
                    }
                    reader.readAsDataURL(file)
                }
            }
        }

    }

    handleSubmit(e: React.FormEvent<any>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const param = (this.state.picture1.key ? 'key1=' + this.state.picture1.key + '&' : '') +
            (this.state.picture2.key ? 'key2=' + this.state.picture2.key : '')

        // 画像は、/d/_html/img/{key} としてサーバに保存されます
        axios({
            url: '/s/savefiles?' + param,
            method: 'post',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: formData

        }).then(() => {
            alert('success')
        }).catch((error: AxiosError) => {
            if (error.response) {
                alert('error=' + JSON.stringify(error.response))
            } else {
                alert('error')
            }
        })

    }

    render() {
        return (
            <Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
                <img src={this.state.picture1.value} />
                <br />
                <img src={this.state.picture2.value} />
                <br />
                <FormGroup>
                    <FormControl type="file" name="picture1" onChange={(e) => this.handleChange(e)} />
                </FormGroup>
                <FormGroup>
                    <FormControl type="file" name="picture2" onChange={(e) => this.handleChange(e)} />
                </FormGroup>
                <FormGroup>
                    <Button type="submit" className="btn btn-primary">
                        登録
                    </Button>
                </FormGroup>
            </Form>
        )
    }
}

ReactDOM.render(<UploadPictureForm />, document.getElementById('container'))
サーバサイドJavaScript(/server/savefiles.tsx)

import * as vtecxapi from 'vtecxapi'

interface Param {
    picture1: string
    picture2: string
}

const param: Param = {
    picture1: vtecxapi.getQueryString('key1'),
    picture2: vtecxapi.getQueryString('key2')
}

vtecxapi.saveFiles(param)
CSVデータアップロード

サーバサイドJavaScriptを利用することでCSVデータのアップロードを行うことができます。vtecxapi.getCsv(header[],items[],parent,skip,encoding)は、指定したパラメータを元にCSVを受信してJSONオブジェクトに変換します。パラメータの意味は以下の通りです。

headerにはCSVのヘッダ情報を指定する。 受信したCSVファイルのヘッダ情報と異なれば {"feed":{"entry":[{"title" : "Header parse error"}]}}のようにパースエラーとなる。
itemsには対応するJSONの項目名を指定する
item1(int)やitem1(boolean)のようにカッコの中にintやbooleanの型を指定可能
parentには変換後のJSONの親項目を指定する。
skipにはCSVファイルの読み飛ばす行数を指定する。
encodingはCSVファイルの文字コードを指定する。(UTF-8,Windows-31J等)
vtecxblankプロジェクトには以下のサンプルプログラムがあります。
デプロイしてログインすると、/upload_csv_sample.htmlを表示できますので、その画面から/data/sample.csvを指定してアップロードしてください。アップロードに成功するとログに読み取った結果のJSONを表示しますので、管理画面のログで確認してください。

画面側(upload_csv_sample.tsx)

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios, { AxiosError } from 'axios'
import {
    Form,
    FormGroup,
    FormControl,
    Button
} from 'react-bootstrap'

/* コンポーネントのPropsの型宣言 */
interface ComponentProps {
}
/* コンポーネントのStateの型宣言 */
interface ComponentState {
}

class UploadCsvForm extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props)
        this.state = {}
    }

    handleSubmit(e: React.FormEvent<any>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        // 画像は、/d/registration/{key} としてサーバに保存されます
        axios({
            url: '/s/getcsv',
            method: 'post',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: formData

        }).then(() => {
            alert('success')
        }).catch((error: AxiosError) => {
            if (error.response) {
                alert('error=' + JSON.stringify(error.response))
            } else {
                alert('error')
            }
        })

    }

    render() {
        return (
            <Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
                <FormGroup>
                    <FormControl type="file" name="csv" />
                </FormGroup>
                <FormGroup>
                    <Button type="submit" className="btn btn-primary">
                        登録
                    </Button>
                </FormGroup>
            </Form>
        )
    }
}

ReactDOM.render(<UploadCsvForm />, document.getElementById('container'))
サーバサイドJavaScript(/server/getcsv.tsx)

import * as vtecxapi from 'vtecxapi'

const items = ['item1', 'item2(int)', 'item3(int)']
const header = ['年月日', '件数', '合計']
const parent = 'order'
const skip = 1 // 1行スキップ
//const encoding = 'Windows-31J'
const encoding = 'UTF-8'

// CSV取得
const result = vtecxapi.getCsv(header, items, parent, skip, encoding)
vtecxapi.log(JSON.stringify(result))
CSVデータ(/data/sample.csv)

// 1行skip
年月日,件数,合計
"2017/7/5",3,3
"2017/7/6",5,8
"2017/7/7",2,10
PDF出力

ReactのSSR(Server Side Rendering)機能とvtecxのPDF出力機能を組み合わせることで動的にPDFを生成することができます。vtecxapi.toPdf(pages,html,outfilename)は、指定したパラメータを元にPDFを生成します。パラメータの意味は以下の通りです。

pagesには出力するPDFのページ数を指定
htmlにはPDFの生成元となるHTMLを指定(テンプレートHTML)
outfilenameにはPDFのファイル名を指定
vtecxblankプロジェクトには以下のサンプルプログラムがあります。
デプロイ後にログインして /s/ssr.pdfにアクセスすると、「Hello, Harper Perez」と表示されたpdfがダウンロードされます。
/pdf/pdfstyles.tsはPDFのレイアウト等を指定するスタイルシートファイルです。以下のようにstyles属性に指定することで色やサイズなど様々なスタイルを設定することができます。詳しくは、「PDFスタイルシート」を参照してください。

サーバサイドJavaScript(/server/ssr.pdf.tsx)

import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/pdfstyles'

interface User {
    firstName: string
    lastName: string
}

function formatName(user: User) {
    return user.firstName + ' ' + user.lastName
}

const user: User = {
    firstName: 'Harper',
    lastName: 'Perez'
}

const element = (
    <html>
        <body>
            <div className="_page" style={pdfstyles._page}>
                <table style={pdfstyles._table}>
                    <tr>
                        <td>
                            <p> Hello, {formatName(user)}! </p>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
    </html>
)

const html = ReactDOMServer.renderToStaticMarkup(element)

// PDF出力
vtecxapi.toPdf(1, html, 'test.pdf')
PDF用スタイルファイル(/pdf/pdfstyles.ts)

export const _page: any = {
    pagesize: 'A4',
    orientation: 'portrait'
}

export const _table: any = {
    bgcolor: '#FFEC8B',
    frame: 'box',
    cellspacing: '3',
    cellpadding: '3',
    width: '90%',
    align: 'left'
}
メール送信

vtecxapi.sendMail(entry: any, to: string[] | null, cc?: string[], bcc?: string[], attachments?: string[])によりメールを送信することができます。
パラメータには以下を指定します。

entry
title : メールのタイトル
summary : テキストメール本文(必須)
content : HTMLメール本文(任意、インライン画像を指定可能)
to : 送信先アドレス (複数指定の場合配列で指定)
cc : CCでの送信先アドレス (配列で指定)
bcc : BCCでの送信先アドレス (配列で指定)
attachments : 添付ファイル(コンテンツのキーを複数指定可能)
entryのsummaryにはテキストメール本文を、contentにはHTMLメール本文を指定します。HTMLメールを送信できない場合はテキストメールが送信されます。
HTMLメールのインライン画像は <img src="CID:/_html/img/ajax-loader.gif">のように、CIDに続けてキーのURLを指定します。
以下はメールを送信するvtecxblankのサンプルプログラムです。

/server/sendmail.tsx

import * as vtecxapi from 'vtecxapi'

const mailentry = {
    'entry': {
        'title': 'sendmail テスト',
        'summary': 'hello text mail',
        'content': {
            '______text': '<html><body>hello html mail <img src="CID:/_html/img/ajax-loader.gif"></body></html>'
        }
    }
}

const to = ['xxxx@xxx']
const cc = ['xxxx@xxx']
const bcc = ['xxxx@xxx']
const attachments = ['/_html/img/vtec_logo.png']

vtecxapi.sendMail(mailentry, to, cc, bcc, attachments)
これを実行するには、あらかじめpropertiesにメール送信のための設定を行う必要があります。/_settings/properties.xmlに直接記述するか管理画面の「メール|詳細設定」から設定してください。

送信元の指定方法

_mail.from={送信元アドレス}
_mail.from.personal={送信者名}
_mail.password={認証アカウントのパスワード}
_mail.transport.protocol={送信プロトコル}   // "smtp"または"smtps"(Gmailはこちら)。デフォルトは"smtp"。
_mail.smtp.host={SMTPサーバ}
_mail.smtp.port={SMTPポート番号}
_mail.smtp.auth={認証する場合true(デフォルトはtrue)}
_mail.smtp.starttls.enable={STARTTLSを利用する場合true(デフォルトはtrue)}
以下はgmailで送信するための設定例です。

_mail.from=foo@gmail.com
_mail.from.personal=foo
_mail.password=xxx
_mail.transport.protocol=smtps
_mail.smtp.host=smtp.gmail.com
_mail.smtp.port=587
_mail.smtp.auth=true
認証付きリンク

送信するメール本文(テキストメールおよびHTMLメール)に以下の文字列が設定されている場合に認証トークンに変換します。例えば、メールの本文に${RXID=Key}を挿入することで、RXIDを含むURLが自動的に組み立てられます。RXIDは送信先のアカウントのものが生成されます。Keyにはコンテキストパスまで自動的に付加されるためそれ以降のパスを指定してください。

${URL} : URLに変換
${RXID=/Key} : キーと送信先メールアドレスのRXIDをつけたURLを組み立てて変換
${LINK=/Key} : キーと送信先メールアドレスのリンクトークンをつけたURLを組み立てて変換
挿入文: ${RXID=/setpass.html}&value=abc
実際のメール本文: https://test.vte.cx/setpass.html?_RXID=xxx&value=abc
また、変換に際して以下のようなルールがあります。

変換は送信先が1件の場合のみ。送信先を複数指定している場合はブランクに変換さる
送信先メールアドレスがそのサービスでユーザ登録されていない場合はブランクに変換される。(※正確にはメールアドレスからアカウント使用可能文字だけ取り出し、アカウントを検索しています）
キー指定部分(/Key)に#が設定されている場合は送信先ユーザのUIDに変換される。
メール受信

vtecxapi.getMail(settings)によりメールを受信することができます。受信結果はfeedのentryに格納されます。複数件受信すると複数件のentryが返ります。
feed.entryの各項目には以下のようにメールの情報がセットされます。()が対応するメールの情報

title(subject)
subtitle(cc)
summary(メール本文)
content(添付ファイル) ※ Base64に変換されます
content.type(ファイルの形式)
content.src(ファイル名)
vtecxblankのmail受信サンプル(/server/getmail.js)では、/s/getmailにアクセスすると、Yahoo!メールの設定情報を元にメールを受信します。
vtecxapi.getMail(settings)のsettingsパラメータにはメール受信のための設定を入れます。

mail受信サンプル(/server/getmail.js)

import * as vtecxapi from 'vtecxapi'

const settings: { [index: string]: string } = {}

// 基本設定(例：yahooメール)
settings['mail.pop3.host'] = 'pop.mail.yahoo.co.jp'
settings['mail.pop3.port'] = '995'
// タイムアウト設定
settings['mail.pop3.connectiontimeout'] = '60000'
//SSL関連設定
settings['mail.pop3.socketFactory.class'] = 'javax.net.ssl.SSLSocketFactory'
settings['mail.pop3.socketFactory.fallback'] = 'false'
settings['mail.pop3.socketFactory.port'] = '995'

settings['username'] = 'xxxxx@yahoo.co.jp'
settings['password'] = 'xxxxx'

const result = vtecxapi.getMail(settings)
vtecxapi.log(JSON.stringify(result))
BigQuery連携

vtecxapi.postBQ(request,async,tablenames?)によりBiqQueryにデータを登録することができます。(※ BigQuery連携を使うには事前に設定が必要です。詳しくは、システムフォルダと各種設定を参照してください)
requestはエントリスキーマで定義されたJSONオブジェクトになります。第一階層の項目名がテーブル名に対応します。tablenamesに第一階層の項目名とテーブル名を指定することで異なる名前をテーブル名に指定することができます。tablenamesには、tablanames['{エンティティの第一階層名}']='{Bigqueryテーブル名}' を指定します。例えば、エンティティの第一階層名がfooでテーブル名がbarの場合、const tablenames = { foo : 'bar' }になります。BigQueryのスキーマはエントリスキーマから自動的に作成されるため定義する必要はありません。
エントリスキーマ以外では、key (STRING)、updated (DATETIME)、deleted (BOOL)項目が自動的に登録されます。

vtecxapi.deleteBQ(keys,async,tablenames?)により、BigQueryのデータを削除することができます。これは論理削除であり、実際にはdeletedがtrueのレコードが登録されます。

vtecxapi.getBQ(sql,parent)で登録したデータをJSONとして取得できます。sqlにはBigQueryにおいて実行できるSQL文を指定してください。
また、doResponseBQcsv(sql,filename,header?)により、csvとしてダウンロードできます。
データの更新はなく常に追記される形になるため、sqlでは同じkeyでupdatedが最新かつdeletedがfalseのものを取得するようにしてください。
以下にサンプルコードを示します。

    import * as vtecxapi from 'vtecxapi'

    const reqdata = {
        'feed': {
            'entry': [{
                'foo': { 'bar': 'test', 'baz': 'テスト' },
                'link':
                [{ '___rel': 'self', '___href': '/footest/1' }]
            }
            ]
        }
    }

    vtecxapi.postBQ(reqdata,false)

    // 最新のレコードのみ取得
    const sql = 'select f.key,bar,baz,k.updated from my_dataset.foo as f right join (select key,max(updated) as updated from my_dataset.foo group by key) as k on f.updated=k.updated and f.key=k.key where f.deleted = false'
    const result = vtecxapi.getBQ(sql)
    vtecxapi.log(JSON.stringify(result))

    const keys = ['/footest/1']
    vtecxapi.deleteBQ(keys,true)

ちなみに、エントリスキーマ(/_settings/template)は以下の通りです。これがBigQueryのスキーマとしても使われます。(テーブル=foo、項目=bar,baz)

foo
 bar
 baz
バッチジョブ

サーバサイドJavaScriptをバックグラウンドで実行したい場合にはバッチジョブ機能が使えます。バッチジョブ機能は対象サービスのプロパティ(/_settings/propertiesエントリーのrights)に以下を設定することで動作させることができます。

_batchjob.{ジョブ名}={分} {時} {日} {月} {曜日} {サーバサイドJS名}
{ジョブ名}はサービス内で一意とする。(重複分のジョブは取得されず実行されない。)
{分} {時} {日} {月} {曜日}の部分はlinuxのcrontabコマンドと同じ指定方法。
{サーバサイドJS名}はリクエストで/s/の後に指定する値。(/_html/server/、.jsを含まない。)
以下は毎朝8:30にメール送信するサーバサイドJS(/server/send-mail.js)を実行する設定の例です。

_batchjob.sendmail=30 8 * * * send-mail
バッチジョブ管理テーブルを参照することでバッチジョブの実行結果を確認できます。これはジョブの実行ごとに登録されるため、ジョブの実行ステータスを記録するログとして扱うことができます。

/_batchjob/{ジョブ名}/{ジョブ実行時刻(yyyyMMddHHmm)}のエントリ
上記エントリのtitleにジョブ実行ステータス
subtitleにPod名
ジョブ管理ステータス

waiting : 実行待ち
running : 実行中
succeeded : 成功
failed : 失敗
waiting(実行待ち)のバッチジョブはプロパティの設定を削除することでキャンセルできますが、running(実行中)のバッチジョブはキャンセルできません。

サーバサイドJSタイムアウト設定

対象サービスのプロパティ(/_settings/propertiesエントリーのrights)に以下を設定することで各サービスにおけるサーバサイドJSのタイムアウト設定ができます。ただしこの設定はproductionサービスのみ有効となります。stagingサービスや設定がない場合などではデフォルトの値(300秒)が採用されます。

APサーバからの実行の場合: _javascript.exectimeout={タイムアウト秒}
バッチジョブ実行の場合: _javascript.batchjobtimeout={タイムアウト秒}
