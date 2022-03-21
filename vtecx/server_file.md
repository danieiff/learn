### ファイルアップロード
- 形式はraw, ブラウザから直接アップロードできるFormDataオブジェクト(`multipart/form-data`形式)
- アップロードファイルが一つでありキーも指定されていないとき: ファイル名がエントリのKey
- 複数のとき:
`vtecxapi.saveFiles(param: any): void`
param: `{ [inputタグのname] : '任意のファイル名' }` →`http://{サービス名}.vte.cx/{アップロードファイル名}`で表示
#### 実装例
```tsx: src/components/UploadPictureForm.tsx
// 諸々import
interface Props {
    picture1: any,
    picture2: any,
    [propName: string]: any
}
const UploadPictureForm: React.VFC<Props> = (props) => {
  const [state,setState] = useState( { picture1:{}, picture2:{} } )
  const handleChange = (e: React.FormEvent<any>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files.item(0)
      if (file) {
        const key = '/_html/img/' + encodeURIComponent(file.name)
        const name = e.currentTarget.name
        // 画像以外は処理を停止
        if (!file.type.match('image.*')) return
        // 画像表示
        const reader = new FileReader()
        reader.onload = () => setState( { [name]: { value: reader.result, key: key } } )
        reader.readAsDataURL(file)
      }
    }
  }
  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const param = (state.picture1.key ? 'key1=' + state.picture1.key + '&' : '') +
        (state.picture2.key ? 'key2=' + state.picture2.key : '')

    // 画像は、/d/_html/img/{key} としてサーバに保存される
    try {
      await axios.post( '/s/savefiles?' + param, formData, { headers: { 'X-Requested-With': 'XMLHttpRequest' } } )
    } catch(e) {
      alert(e.response? 'error: ' + JSON.stringify(e.response): 'error')
    }
  }
  return (
    <Form horizontal onSubmit={handleSubmit}>
      <img src={state.picture1.value} />
      <br />
      <img src={state.picture2.value} />
      <br />
      <FormGroup>
        <FormControl type="file" name="picture1" onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <FormControl type="file" name="picture2" onChange={handleChange} />
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
```ts: /server/SavePicture.ts
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
```

`PUT /d/foo?_content` テキストやblobを格納
Content-Type:  image/pngやtext/htmlなど実際に格納したコンテンツに合ったタイプを指定
