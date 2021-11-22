### PDF出力
- `vtecxapi.toPdf(data, html, outfilename, baseurl?)`
  data: `{ページ数}` →any型
  html: `string` →PDFのためのテンプレートHTML
  outfilename: `{任意のファイル名}`　→レスポンスヘッダの`content-disposition: "attachment; filename=\"{outfilename}\""`
  baseurl: `{結合するPDFファイルパス}`
- /pdf/pdfstyles.tsはPDFのスタイルシートファイル
- pdfを返すファイルは`{任意}.pdf.tsx`とする
#### 実装例
```tsx: /server/ssr.pdf.tsx
import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as pdfstyles from '../pdf/pdfstyles'

const element = (
  <html>
    <body>
      <div className="_page" style={pdfstyles._page}>
        <table style={pdfstyles._table}>
          <tr>
            <td>
              <p> Hello World! </p>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
)

const html = ReactDOMServer.renderToStaticMarkup(element)

vtecxapi.toPdf(1, html, 'test.pdf')
```
`<div class="_page">`要素には、`style`属性にページの大きさや向き、余白サイズ、暗号化や署名などを設定できます。
```ts: /pdf/pdfstyles.ts
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
```
### PDFスタイルシート
#### PDFページ構造
```html
<html>
  <body>
    <div class="_page">
      <第一レベル要素>
        <第二レベル要素></第二レベル要素>
      <第一レベル要素>
    </div>
  </body>
</html>`
```
第一レベル要素 →左下点を基準とする絶対座標で指定
- `<table> <tr> <td>` →`<table>`の子要素に`<table>`を指定できない。
- `<img>`
- 図形
第二レベル要素 →第一レベル要素からの相対位置座標で指定
- ブロックレベル要素：`<div>`、`<p>`
- リスト：`<ul>`、`<ol>`
- インライン要素：`<span>`
- `<a>`
- `<img>`
- `<br>`
#### スタイル指定
- `<div class="_page">` style属性で以下を指定

property|value|default
-|-|-
pagesize|`A0～A10, B0～B5, HAGAKI, NOTE, LEGAL, ARCH_E, ARCH_D, ARCH_C, ARCH_B, ARCH_A, FLSA, FLSE, HALFLETTER, _11X17, LEDGER`|`A4`
orientation|`portrait`(縦長),`landscape`(横長)|`portrait`
left, right, top, bottom|余白の数値|`36`
nodata|"nodata"のみ記述 ページ制御の際、オフセットはカウントされるがエンティティのインデックスはカウントされない。|(なし)
footer|ページ数表示	`false/true`|`false`
fontsize|ページ全体のデフォルト文字サイズ数値。p、span、div、chunk、vchunk、paragraph、a、liタグに囲まれた文字のみ適用される。tdタグに記述された文字列には適用されない。|`12`
color|`#xxxxxx`ページ全体のデフォルト文字色。p、span、div、chunk、vchunk、paragraph、a、liタグに囲まれた文字のみ適用される。tdタグに記述された文字列には適用されない。|`#000000`
linecolor|`#xxxxxx`ページ全体のデフォルト罫線色|`#000000`
font|ページ全体のデフォルトフォント`HeiseiKakuGo-W5,HeiseiMin-W3,KozMinPro-Regular`|`HeiseiKakuGo-W5`
title|PDF文書のタイトル	文字列|(なし)
author|PDF文書の作成者	文字列|(なし)
subject|PDF文書のサブタイトル	文字列|(なし)
keywords|PDF文書のキーワード	文字列|(なし)
encryption|暗号化	`40`：「40-bit RC4」、`128`：「128-bit RC4」　パスワードおよび文書に関する制限（allowで始まる属性）を指定した場合暗号化される。このとき本項目を指定していない場合は`128`。|(なし)
password|文書を開くパスワード 文字列（PDFファイルを開く(参照する)際に入力するパスワード。）|(なし)
ownerpassword|権限パスワード 文字列（PDFファイルのセキュリティ設定を変更する際に入力するパスワード。）|(なし)
allowprinting|`true`：印刷可、`false`：印刷不可|`true`
allowmodifycontents|文書の変更	`true`：文書編集可、`false`：文書編集不可|`true`
allowassembly|文書アセンブリ　ページの挿入/削除/回転、しおりとサムネールの作成の可否。	`true`：変更可、`false`：変更不可|false
allowcopy|内容のコピーと抽出	`true`：コピー可、`false`：コピー不可|`true`
allowscreenreaders|アクセシビリティのための内容の抽出　視覚に障碍を持つユーザに対して、スクリーンリーダ(読み上げ)の利用可否。	`true`：可、`false`：不可|`true`
allowmodifyannotations|注釈、フォームフィールドの入力および署名	`true`：編集可、`false`：編集不可|`false`
allowfillin|フォームフィールドの入力および署名 `true`：入力可、`false`：入力不可　注）文書パスワードを付けた場合のみ有効。allowmodifyannotationsが編集可（true）の場合、trueとなる。|`false`

- `<table>` 表を作ることができます。これは、行(<tr>)と列(<td>もしくは<th>)を子要素にもちます。style属性には以下を指定

property|value|default
-|-|-
cols|列数|1
width|幅の縮尺	数値またはパーセント指定|`80%`
cellpadding|全体の縦の間隔	数値|`0`
cellspacing|セル同士の間隔	数値|`0`
frame|罫線	`void,above,below,hsides,vsides,lhs,rhs,box,border` 外枠のみの指定であり、内側の線はtdタグの属性で指定。|`void`
border|枠線の幅 数値|`1`
bordercolor|枠線の色 `#xxxxxx`|ページで指定されたデフォルト罫線色
bgcolor|背景色 `#xxxxxx`|`#FFFFFF`
align|表示位置 `center, left, right`|`center`
widths|各列の幅（どれだけのカラムを割くか）	列数分、割合をカンマでつないで指定。例）`width: 3,4,4;`|(なし)
absolutex, absolutey|ページ内の絶対座標 ページ左下を基点とし、テーブルの右上角の座標を指定。|(なし)
font|テーブルのデフォルトフォント名	フォント名。`"$" + エンティティの項目名`を指定することで、エンティティの内容を適用できる。|(なし)
size|テーブルのデフォルト文字サイズ 数値|(なし)
style|テーブルのデフォルト文字スタイル	`bold`（太字）,`italic`（斜体）,`underline`（下線）,`strikethru`（取消線）　複数指定の場合カンマでつなぐ。|(なし)
color|テーブルのデフォルト文字色	`#xxxxxx`|(なし)

- `<tr>` style属性に以下を指定

property|value|default
-|-|-
font|行のデフォルトフォント名	フォント名|(なし)
size|行のデフォルト文字サイズ	数値|(なし)
style|行のデフォルト文字スタイル `bold`（太字）,`italic`（斜体）,`underline`（下線）,`strikethru`（取消線）　複数指定の場合カンマでつなぐ。|(なし)
color|行のデフォルト文字色 `#xxxxxx`|(なし)

- `<td>` style属性に以下を指定

property|value|default
-|-|-
align|セル内データの横方向の配置	`left,center,right`,`justifyall`（均等割付）|`left`
valign|セル内データの縦方向の配置 `top,middle,bottom,baseline`|`top`
colspan|結合する列数	数値|1
rowspan|結合する行数	数値|1
bordercolor|セルの枠線の色	`#xxxxxx`|ページで指定されたデフォルト罫線色
bgcolor|セルの背景色 `#xxxxxx`|`#FFFFFF`
height|セルの高さ。設定値が最低限保証され、文字の折り返しなどで超える場合はこれ以上の高さとなる。	数値|(なし)
leading|文字の改行ピッチ	セル上枠と文字下部の距離を数値で指定。|`16`
borderwidth|セルの罫線の太さ	数値|`1`
offsetx, offsety|セル内の表示開始座標	セル左下を基点とし、表示内容の左下の座標を指定。|(なし)
space|表示文字列の文字間隔	数値|`0`
roundrighttop, roundrightbottom, roundlefttop, roundleftbottom|セルの右上、右下、左上、左下の角を丸める	`true/false`|`false`
roundr|セルの角を丸める際の曲率	数値|`1`
lefttoprightbottom, righttopleftbottom|セルの左上から右下、右上から左下へ斜線を引く	`true/false`|`false`
linehscale, linevscale|セルの罫線を横、縦方向に拡大・縮小	中心からの倍率を指定。拡大時は1より大きな数値、縮小時は0.x。|`1`
doubleline|セルの罫線を二重線にする	`true/false`|`false`
left, right, top, bottom|左右上下の枠線	`true/false`|`false`
nowrap|改行しない。セルに収まる分のみ表示される。	`true/false`|`false`
font|セルのデフォルトフォント名	フォント名。"$" + エンティティの項目名を指定することで、エンティティの内容を適用できる。|(なし)
size|セルのデフォルト文字サイズ	数値|(なし)
style|セルのデフォルト文字スタイル	`bold`（太字）,`italic`（斜体）,`underline`（下線）,`strikethru`（取消線）　複数指定の場合カンマでつなぐ。|(なし)
color|セルのデフォルト文字色 `#xxxxxx`|(なし)

- 文字列
  `<p>,<div>`→文字列表示の後に改行
  `<span>`　→改行されない。style属性には以下を指定できます。

property|value|default
-|-|-
font|フォント名|セル、行、テーブル、ページで指定されたデフォルトフォント
size|文字サイズ数値|セル、行、テーブル、ページで指定されたデフォルト文字サイズ
style|	`bold`（太字）,`italic`（斜体）,`underline`（下線）,`strikethru`（取消線）　複数指定の場合カンマでつなぐ。`vertical:true`の場合指定しないこと。|セル、行、テーブルで指定された文字スタイル
color|文字の色`#xxxxxx`|セル、行、テーブル、ページで指定されたデフォルト文字色
nowrap|改行しない。セルを超えて表示される。	`true/false`|`false`
hscale|文字の横幅割合	1を基準とした割合。縮めるなら0.x、広げるなら1より大きな数字。|`1`
vertical|縦書き `true/false`|`false`
offsetx, offsety|セル内の文字列表示開始座標	セル左下を基点とし、表示内容の左下の座標を指定。|(なし)

- 改行`<br/>`(必ず最後にスラッシュを入れて閉じてください)
- リンク `<a>`href属性にリンク先URL 表示文字列は、`<p>,<div>,<span>`で囲む
- リスト`<ul>、<ol>、<li>`
`<li>`内の文字列は、`<p>,<div>,<span>`で囲んでレイアウトを編集してください。シンボルは`<ul>、<ol>`タグでレイアウト編集できます。style属性には以下を指定できます。

property|value|default|a
-|-|-|-
type|ulの場合固定文字。olの場合項目番号。	ulの場合任意の一文字。olの場合、`1`, `A`, `a`|ulの場合 `-` olの場合 `1`
start|olの場合に使用。項目番号の開始文字。|`1`, `A`, `a` のいずれか	typeが`A`, `a`の場合開始したいアルファベット。|type未指定もしくは`1`の場合数字
symbolindent|数値(11.0ぐらいをデフォルトでセットしないと重なってしまう） `true/false`|(なし)
font|シンボルのフォントページで指定されたデフォルトフォント|フォント名
size	シンボルのフォントサイズ	ページで指定されたデフォルトフォントサイズ	数値
style	シンボルのスタイル	(なし)	bold（太字）,italic（斜体）,underline（下線）,strikethru（取消線）　複数指定の場合カンマでつなぐ。
color	シンボルの文字色	ページで指定されたデフォルト文字色	#xxxxxx
leading	文字の改行ピッチ	16	セル上枠と文字下部の距離を数値で指定。
画像

画像は<img>タグを使用します。src属性に画像のurl、width属性に画像の幅、height属性に画像の高さを指定してください。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
plainwidth	画像の幅。widthより優先される。	(なし)	数値
plainheight	画像の高さ。heightより優先される。	(なし)	数値
rotation	回転	0	数値
absolutex, absolutey	ページ内の絶対座標	(なし)	ページ左下を基点とし、画像の左下角の座標を指定。
線

<div class="_line">で線を描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
linewidth	線の幅	1	数値
color	線の色	#000000	#xxxxxx
x1, y1	開始点の座標	(なし)	数値
x2, y2	終了点の座標	(なし)	数値
linedushon	描画する線を破線にする場合、表示部分の長さを設定	1	数値
linedushoff	描画する線を破線にする場合、非表示部分の長さを設定	0	数値
四角形

<div class="_rectangle">で四角形を描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
linewidth	線の幅	1	数値
width	四角形の幅	0	数値
height	四角形の高さ	0	数値
color	四角形の線の色	#000000	#xxxxxx
absolutex, absolutey	ページ内の絶対座標	(なし)	ページ左下を基点とし、四角形の左下角の座標を指定。
linedushon	描画する線を破線にする場合、表示部分の長さを設定	1	数値
linedushoff	描画する線を破線にする場合、非表示部分の長さを設定	0	数値
角丸四角形

<div class="_roundrectangle">で四角形を描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
linewidth	線の幅	1	数値
width	四角形の幅	0	数値
height	四角形の高さ	0	数値
roundr	角の曲率	1	数値
color	四角形の線の色	#000000	#xxxxxx
absolutex, absolutey	ページ内の絶対座標	(なし)	ページ左下を基点とし、四角形の左下角の座標を指定。
linedushon	描画する線を破線にする場合、表示部分の長さを設定	1	数値
linedushoff	描画する線を破線にする場合、非表示部分の長さを設定	0	数値
円

<div class="_circle">で円を描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
linewidth	線の幅	1	数値
absolutex, absolutey	ページ内の絶対座標	(なし)	ページ左下を基点とし、円の左下角の座標を指定。
radius	円の半径	(なし)	数値
linedushon	描画する線を破線にする場合、表示部分の長さを設定	1	数値
linedushoff	描画する線を破線にする場合、非表示部分の長さを設定	0	数値
color	円の線の色	#000000	#xxxxxx
export const _page: any = {
  pagesize: 'A4',
  orientation: 'landscape'
}