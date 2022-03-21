## CSVアップロード
### クライアントサイド
```tsx: /src/components/UploadCSV.tsx
// import
const UploadCSVForm: React.VFC = () => {
  const [state, setState] = useState({})
  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await axios.post( '/s/readCSV', formData, { headers: { 'X-Requested-With': 'XMLHttpRequest' } } )
  }
  return (
    <form  onSubmit={handleSubmit}>
      <input type="file" name="csv" />
      <button type="submit" > 登録 </button>
    </form>
  )
}
```
### サーバーサイド
```tsx: /server/readCSV.ts
import * as vtecxapi from 'vtecxapi'

const items = ['item1', 'item2(int)', 'item3(int)'] // プロパティ名 (型を指定可能)
const header = ['Date', 'Count', 'Total_Count'] // ヘッダのプロパティ名
const parent = 'csv' // 変換後のJSONの親プロパティ名
const skip = 1 // CSVファイルの読み飛ばす行数
const encoding = 'UTF-8' //'Windows-31J'等

const result = vtecxapi.getCsv(header, items, parent, skip, encoding)

vtecxapi.log(JSON.stringify(result))
// CSVデータ(/data/sample.csv)
// // 1行skip
// 年月日,件数,合計
// "2017/7/5",3,3
// "2017/7/6",5,8
// "2017/7/7",2,10
```

## CSV出力
### サーバーサイド
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
const outfilename = 'user.csv' // レスポンスヘッダのcontent-disposition: "attachment; filename=\"{csvのファイル名}\""
vtecxapi.doResponseCsv(csv,outfilename)
```
### クライアントサイド
`GET '/s/user.csv'`
```ts
axios.get('/s/user.csv', {responseType: 'blob'})
```
## BigQueryからCSV出力 `doResponseBQcsv(sql,filename,header?)`

## csvクライアント表示
