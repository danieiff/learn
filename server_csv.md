### CSVアップロード
- `vtecxapi.getCsv(header, items, parent?, skip?, encoding?)`
  header: `[項目1の名前, 項目2の名前, ...]`
  items: `['item1(int/boolean), 'item2', ...]` →対応するJSONの項目名。 カッコの中で型を指定可能
  parent: `string` →変換後のJSONの親項目を指定する。
  skip: `{CSVファイルの読み飛ばす行数}`
  encoding: `{UTF-8, Windows-31J等文字コード}`
#### 実装例
```tsx: /src/components/UploadCsv.tsx
// import
const UploadCsvForm: React.VFC = () => {
  const [state, setState] = useState({})
  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // 画像は、/d/foo/{key} としてサーバに保存されます
    try {
      await axios.post( '/s/getcsv', formData, { headers: { 'X-Requested-With': 'XMLHttpRequest' } } )
    } catch(e) {
      alert(e.response? 'error: ' + JSON.stringify(e.response): 'error')
    }
  }
  return (
    <Form horizontal onSubmit={handleSubmit}>
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
```
```tsx: /server/GetCsv.ts
import * as vtecxapi from 'vtecxapi'

const items = ['item1', 'item2(int)', 'item3(int)']
const header = ['年月日', '件数', '合計']
const parent = 'order'
const skip = 1
const encoding = 'UTF-8' //const encoding = 'Windows-31J'
// CSV取得
const result = vtecxapi.getCsv(header, items, parent, skip, encoding)
vtecxapi.log(JSON.stringify(result))
```
```
CSVデータ(/data/sample.csv)
// 1行skip
年月日,件数,合計
"2017/7/5",3,3
"2017/7/6",5,8
"2017/7/7",2,10
```
### CSV出力
- csvを返すファイルは *`{任意}.csv.ts/tsx`* とする
- `vtecxapi.getBQ(sql)` vte.cxからBigQueryに対してSQLを実行
- `vtecxapi.doResponseCsv([ header, row1, row2, ... ], outfilename)`
  header:  `[項目1の名前, 項目2の名前, ...]`
  row: `[項目1の値,項目2の値, ...]` →headerと項目の順番を対応させる
  outfilename: `{任意のファイル名}` →レスポンスヘッダのcontent-disposition: "attachment; filename=\"{csvのファイル名}\""
#### 実装例
```ts: user.csv.ts
import * as vtecxapi from 'vtecxapi'

const DATASET = '{BigQueryの該当データセット名}'
const TABLE = '{BigQueryの該当テーブル名}'
const SCHEMA = {userid:'ID',name:'名前',gender:'性別',age:'年齢',birth:'生年月日',email:'メールアドレス',tel:'電話番号',postcode:'郵便番号',address:'住所',memo:'備考欄'}
const ITEMS = Object.keys(SCHEMA)
const TITLES = Object.values(SCHEMA)
const ORDER = 'order by f.userid asc'
const sql = `
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
  f.deleted = false
${ORDER}
`
const feed = vtecxapi.getBQ(sql) // [ {userid: 1, name: '{名前}', ... }, ... ]
const body = feed.map((entry: any) => ITEMS.map(item => entry[item] ?? '未登録')) // [ ['{ID}', '{名前}', ..., '{備考欄}'], ["], ["], ... ]
const csv = [TITLES, ...body]

vtecxapi.doResponseCsv(csv, 'user.csv')
```
`GET '/s/user.csv'`
```ts
axios.get('/s/user.csv', {responseType: 'blob'})
```
#### BigQueryからCSVダウンロード `doResponseBQcsv(sql,filename,header?)`