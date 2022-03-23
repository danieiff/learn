/* eslint-disable */
// @ts-nocheck

// ## CSVアップロード
// src/components/UploadCSV.tsx
const UploadCSVForm: React.VFC = () => {
  const [state, setState] = useState({})
  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await axios.post('/s/readCSV', formData, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type='file' name='csv' />
      <button type='submit'>登録</button>
    </form>
  )
}

// src/server/readCSV.ts
import * as vtecxapi from 'vtecxapi'

const items = ['item1', 'item2(int)', 'item3(int)'] // プロパティ名 (型を指定可能)
const header = ['Date', 'Count', 'Total_Count'] // ヘッダのプロパティ名
const parent = 'csv' // 変換後のJSONの親プロパティ名
const skip = 1 // CSVファイルの読み飛ばす行数
const encoding = 'UTF-8'

const result = vtecxapi.getCsv(header, items, parent, skip, encoding)

vtecxapi.log(JSON.stringify(result))
// CSVデータ(/data/sample.csv)
// // 1行skip
// 年月日,件数,合計
// "2017/7/5",3,3
// "2017/7/6",5,8
// "2017/7/7",2,10

// ## CSV出力
// src/server/user.csv.ts
import * as vtecxapi from 'vtecxapi'
const KEY = '/_user'
const SCHEMA = {
  userid: 'ID',
  name: '名前',
  gender: '性別',
  age: '年齢',
  birth: '生年月日',
  email: 'メールアドレス',
  tel: '電話番号',
  postcode: '郵便番号',
  address: '住所',
  memo: '備考欄',
}
const ITEMS = Object.keys(SCHEMA)
const TITLES = Object.values(SCHEMA)

const feed = vtecxapi.getFeed(KEY) // [ {userid: 1, name: '{名前}', ... }, ... ]
const body = feed.map((entry: any) =>
  ITEMS.map((item) => entry[item] ?? '未登録')
) // [ ['{ID}', '{名前}', ..., '{備考欄}'], ... ]
const csv = [TITLES, ...body]
const outfilename = 'user.csv' // レスポンスヘッダのcontent-disposition: "attachment; filename=\"{csvのファイル名}\""
vtecxapi.doResponseCsv(csv, outfilename)

// Client
const blob_response = axios.get('/s/user.csv', { responseType: 'blob' })
// const url = createObjectURL(blob)
// <a href=url></a>

// ## BigQueryからCSV出力 `doResponseBQcsv(sql,filename,header?)`

// toXls(data: any, inputxls: string, outfilename: string): void	XLSを出力する
