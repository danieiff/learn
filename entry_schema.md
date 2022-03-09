## エントリ内に存在するプロパティをスキーマに定義する
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
birth(date) // yyyy-MM-dd HH:mm:ss.SSS{タイムゾーン([ISO 8601] +99:99、+9999、+99)} "-"→"/"or""  " "→"T"or"" ":"→""  "."→""  "HH"以降任意
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
