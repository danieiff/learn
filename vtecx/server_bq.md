vte.cxのデータストアをBigQueryにして、vte.cxのAPIを通してSQLを実行します
### 0. BigQueryの準備
1. データセット作成
2. BigQueryのサービスアカウント秘密鍵作成
  サービスアカウントとは、Googleの各サービスに対する権限を持つアカウントです。Googleのサービスに対しAPIリクエストを行う際に認証情報として使用します。
### 1. vte.cx側の連携設定
1. setup/_settings直下にbigquery.jsonをおく
```json
{
    "type": "XXX",
    "project_id": "XXX",
    "private_key_id": "XXX",
    "private_key": "XXX",
    "client_email": "XXX",
    "client_id": "XXX",
    "auth_uri": "XXX",
    "token_uri": "XXX",
    "auth_provider_x509_cert_url": "XXX",
    "client_x509_cert_url": "XXX"
}
```
2. `properties.xml`の`rights`項目に三行追記
```
_bigquery.projectid={プロジェクトID}
_bigquery.dataset={データセット名}
_bigquery.location=asia-northeast1
```
3. `npm run upload`
### 登録
初回登録時にvte.cx側のスキーマの項目と、`key (STRING)`, `updated (DATETIME)`,`deleted (BOOL)`項目を持つテーブル作成されます
`postBQ(request: any, async: boolean, tablenames?: any): void`
#### APIの解説
request:
```xml: template.xml抜粋
<content>foo
 bar(string)
 baz(string)</content>
```
`request`↓は上のスキーマに対応する
```
[
  {
    foo: { bar: 'test', baz: 'テスト' },
    link: [{ ___rel: 'self', ___href: 'エントリごとに一意' }]
  }
]
```
`link`の`___rel: 'self'`に対して、`___href`は通例`'/{エンドポイントのキー名}/{採番処理で振られたID番号}'`とする
`___href`の値がBigQueryテーブルに`key`項目として登録されます
async:_
tablenames: `{ '第一階層の項目名' : 'テーブル名' }` 指定することで異なるテーブルに登録できる。
#### 上のスキーマでの実装例
```ts: /src/server/registerBQ.ts
import * as vtecxapi from 'vtecxapi'

const KEY = 'somefoo'
const END_POINT = '/d/' + KEY
const PARENT = 'foo'
const TABLE = 'footable' // 'リクエストはこのテーブルに登録される'

const [{ foo }] = vtecxapi.getRequest()

const id = vtecxapi.allocids(END_POINT, 1) //採番

const request = [
  { [PARENT]: { ...foo, id }, link: [{ ___href: `/${KEY}/${id}`, ___rel: 'self' }] }
]

const result = vtecxapi.postBQ(request, false, { [PARENT]: TABLE }) //　冗長に引数tablenamesを記述した例
vtecxapi.doResponse({ feed: { title: result } }) // ATOM形式のレスポンスのtitle項目に結果を持たせる
```
↑ファイルに対して
```ts: /src/components/register.ts
const foo =  { bar: 'test', baz: 'テスト' }
axios.put('/s/registerBQ', [{ foo }] ) // 通例としてPOSTよりPUTを使う
```
### 取得
`getBQ(sql: string, parent?: string): any`
parent: 実行結果はparentの子要素になる。エントリ内でスキーマやATOM項目にない項目を指定するとエラー
SQLを実行して取り出したデータを返す
データの更新はなく常に追記されるため、同じ`key`のうち `updated`が最新かつ`deleted=false`のものを取得するSQLを実行させる
#### 実装例
```ts: /src/server/readBQ.ts
import * as vtecxapi from 'vtecxapi'

const DATASET = '{BigQueryの該当データセット名}'
const TABLE = '{BigQueryの該当テーブル名}'
const SCHEMA = {userid:'ID',name:'名前',gender:'性別',age:'年齢',birth:'生年月日',email:'メールアドレス',tel:'電話番号',postcode:'郵便番号',address:'住所',memo:'備考欄'}
//　あらかじめ用意したテーブルから作成
const ITEMS = Object.keys(SCHEMA)
const TITLES = Object.values(SCHEMA)
const ORDER = 'order by f.userid asc'
const sql = `
select
  ${ITEMS.join(',') /* =>'useid,name,...,memo' */}
from
  ${DATASET}.${TABLE} as f
  right join
    ( select
        key,
        max(updated) as updated
      from
        ${DATASET}.${TABLE}
        group by
          key
    ) as k
    on
      f.updated = k.updated and
      f.key = k.key
where
  f.deleted = false
${ORDER}
`
const result = vtecxapi.getBQ(sql, PARENT) // 冗長に引数parentを指定した例
vtecxapi.doResponse(result)
```
```ts: /src/components/read.ts
 const read = async () => await axios.get('/s/readBQ')
```
### 編集
編集するデータの`key`で勝手に新しく登録します。
### 削除
`postBQ`→引数`request`の`link`の`___href`がテーブルに`key`項目として登録される。
`deleteBQ`→引数`keys: string[]`にテーブルの`key`項目を入れる
→`deleted`が`true`のレコードが登録される

`deleteBQ(keys: string[], async: boolean, tablenames?:any): void`
keys: `linkのhref項目`
async:_
tablenames: `{ '第一階層の項目名' : 'テーブル名' }` →異なるテーブルで削除
#### 実装例
```ts: /src/components/delete.tsx
// userエントリの形 { userid: 1 , name: 太郎, ... }
const keys = [user1, user2, ...].map(({ userid }) => userid)
const delete = async () => await axios.put('/s/deleteBQ', keys)
```
```ts: /src/server/deleteBQ.ts
const _keys = vtecxapi.getRequest()
const keys = _keys.map(id => `/${TABLE}/${id}`)
vtecxapi.deleteBQ(keys, false, { [PARENT]: TABLE })
```
### 全件数を取得
```ts :getTotal.ts
// vtecxapi.getQueryString(param:string)で検索条件など取得できる
const sql =`
select
  cast(count(*) as string) as title
from
  ${DATASET}.${TABLE} as f
  right join
    ( select
        key,
        max(updated) as updated
      from
        ${DATASET}.${TABLE}
        group by
          key
    ) as k
    on
      f.updated = k.updated and
      f.key = k.key
where
  f.deleted = false
  ${/*検索条件など*/}
`
const total = getBQ(sql) // =>[ { 'title': '合計件数' } ] ←SQLクエリの'as title'によって結果が'title'に入る
vtecxapi.doResponse(total) // レスポンスに入れるエントリにはATOM項目とユーザー定義スキーマの項目のみを入れられる
```
### ページネーションと検索を実行するSQL例
#### `OFFSET`句を利用したページネーションと検索機能
```ts: /src/server/getUsers.ts
import * as vtecxapi from 'vtecxapi'
import { escape } from 'sqlstring'

const DATASET = 'データセット名'
const TABLE = 'テーブル名'
// テーブルから取得する項目
const ITEMS = [ 'name', 'userid', 'gender', 'birth', 'age', 'tel', 'email', 'address', 'postcode', 'memo']
//　SQLクエリを組み立てる
// 検索のためのクエリ
// クエリパラメータ'search'から'name'項目の検索キーワードを設定
const search = vtecxapi.getQueryString('search')
const name_search = search ? ` and name = "${escape(search)}"` : ''
// ページネーションのためのクエリ
// クエリパラメータ'page'からページを設定
const page_num = Number(vtecxapi.getQueryString('page')) || 1
const pagination = `limit 5 offset ${escape(page_num - 1)}` // 5件ずつ
const conditions = `${name_search} order by f.userid desc ${pagination}`
const total = vtecxapi.getBQ(sql_total) // =>[ { 'title': '合計数' } ] sql文で'as title'としているため。
// ページネーションのためにフィードを数件ごとに取得
const sql_feed = `
select
  ${ITEMS.join(',')}
from
  ${DATASET}.${TABLE} as f
  right join
  ( select
      key,
      max(updated) as updated
    from
      ${DATASET}.${TABLE}
      group by
        key
  ) as k
  on
    f.updated = k.updated and
    f.key = k.key
where
  f.deleted = false
  ${conditions}
`
// 'select userid,name,gender,age,email,tel,postcode,address,memo, from ${DATASET}.${TABLE} as f right join (select key,max(updated) as updated from ${DATASET}.${TABLE} group by key) as k on f.updated=k.updated and f.key=k.key where f.deleted=false'

const result = vtecxapi.getBQ(sql_feed, PARENT)
vtecxapi.doResponse(result) // =>[ { 'user': { 'userid': '1', 'name': '太郎', ... } }, ... ]
```

`LIMIT`, `OFFSET`を使うページネーションはオフセット方式といいます。
#### キーセット法によるページネーション
テーブルから一意な`id`項目を`LENGTH`行ごとに抽出したもの(→キーセット)を利用して、任意ページの`LENGTH`個のデータを取得するSQLを発行する

クライアント側
URLクエリパラメータ`?page=1`(とする)からページ番号を取得するフック
```ts: src/hooks/usePage.tsx
import { useLocation } from 'react-router-dom'
export const usePage = () => {
  const _search_params = useLocation().search
  const search_params = new URLSearchParams(_search_params)
  const page = Number(query.get('page')) || 1
  return page
}
```
ページネーションのためのキーセットを取得するリクエストと､そのキーセットと上のフックによって取得するページ番号を利用して目的のフィードをリクエストする
```tsx: /src/components/getUsers.tsx
import { usePage } from '../hooks/usePage'
const shouldUpdateKeyset = useRef(true)
const Users = () => {
  const [keyset, setKeyset] = useState([])
  const page = usePage()
  const [feed, setFeed] = useState([])
  const getFeed = () => {
    if (shouldUpdateKeyset.current) {
      const _keyset = async () => await axios.get('/s/getKeyset')
      // =>[ { title: '11', subtitle: '1' }, { title: '5', subtitle: '2' }, { title: '1', subtitle: '3' } ]
      // (データが15個ある場合), 'title'に`userid`、`subtitle`にページ番号
      setKeyset(_keyset.data.map(({title})=>title))
      shouldUpdateKeyset.current = false
    }
    if (keyset.hasOwnProperty(page-1)) {
      const _feed = await axios.get(`/s/getUsers?pagekey=${keyset[page-1]?.title}`)
      setFeed(_feed)
    }
  }
  useEffect(getFeed,[])
  return // feedを描写
}
```
サーバー側
1. ページのキーセットを抽出
```ts: /src/server/getKeyset.ts
import * as vtecxapi from 'vtecxapi'
const DATASET = 'データセット'
const TABLE = 'テーブル'
const LENGTH = 5
const ORDER = 'order by userid desc'
const keyset = getBQ(`
with x as (
  select
    case
      mod(
        row_number()
        over(
          ${ORDER}
        ),
        ${LENGTH}
      )
    when 0
      then 1
    else 0
    end as page_boundary,
    f.*
  from
    ${DATASET}.${TABLE} as f
      right join (
        select
          key,
          max(updated) as updated
        from
          ${DATASET}.${TABLE}
          group by
            key
      ) as k
      on
        f.updated = k.updated and
        f.key = k.key
  where
    f.deleted = false
  ${ORDER}
)
select
  userid as title,
  cast (
    row_number()
    over(
      ${ORDER}
    ) + 1
    as string
  ) as subtitle
from
  x
where
  x.page_boundary = 1
`)
vtecxapi.doResponse(keyset)
```
2. 上で作られたページキーを利用して作られたリクエストに対して､フィードを返す
```ts: /src/server/getUsers.ts
import * as vtecxapi from 'vtecxapi'
import { escape } from 'sqlstring'

const DATASET = 'データセット'
const TABLE = 'テーブル'
const LENGTH = 5
const pagekey = escape(vtecxapi.getQueryString('pagekey')) || 0
const ITEMS = [ 'name', 'userid', 'gender', 'birth', 'age', 'tel', 'email', 'address', 'postcode', 'memo']
const feed = vtecxapi.getBQ(`
select
  ${ITEMS.join(',') /* =>'useid,name,...,memo' */}
from
  ${DATASET}.${TABLE} as f
  right join (
    select
      key,
      max(updated) as updated
    from
      ${DATASET}.${TABLE}
      group by
        key
  ) as k
  on
    f.updated = k.updated and
    f.key = k.key
where
  f.deleted = false and
  cast(userid as int) >= ${pagekey/*'userid'がページキーである'userid'と等しいか、それより小さい行を'LENGTH'分だけ抽出*/}
${ORDER/*'userid'降順*/}
limit ${LENGTH}
`)
```
\+ 必要に応じてデータの合計数を取得する､結果をフィルターする(→検索機能)など｡
### 注意
sql の `select`と前の\`の間と`select`の後の句の間改行あるとエラーになる避ける
