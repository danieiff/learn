/* eslint-disable */
// @ts-nocheck

// src/server/put_pdf.tsx
import * as vtecxapi from 'vtecxapi'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as pdf_styles from '../pdf/pdf_styles'

const element = (
  <html>
    <body>
      <div className='_page' style={pdf_styles._page}>
        <table style={pdf_styles._table}>
          // ↓ この中を編集
          <tr>
            <td>
              <p> Hello World! </p>
            </td>
          </tr>
          // ↑
        </table>
      </div>
    </body>
  </html>
)
const dom_str = ReactDOMServer.renderToStaticMarkup(element)
const fullpage_n = 1
const outfilename = 'test.pdf' 
vtecxapi.toPdf( fullpage_n, dom_str, outfilename /* 結合するベースPDFファイルパス */)

// src/pdf/pdf_styles.ts
const pdf_styles = {
  _page: {
    //  pagesize: `A0～10`, `B0～5`, [`A4`]
    //  orientation: [`portrait`], `landscape`
    //  left, right, top, bottom: [`36`]
    //  nodata: `""` ページ制御の際に、オフセットはカウントされて、エンティティのインデックスはされない。
    //  footer: [`false`], `true` ページ数表示
    //  fontsize: p、span、div、chunk、vchunk、paragraph、a、liのデフォルト文字サイズ [`12`]
    //  color: p、span、div、chunk、vchunk、paragraph、a、liのデフォルト文字色 [`#000000`]
    //  linecolor: ページ全体の罫線色 [`#000000`]
    //  font: `HeiseiKakuGo-W5,HeiseiMin-W3,KozMinPro-Regular` [`HeiseiKakuGo-W5`]
    //  title: PDFタイトル
    //  author: PDF作成者
    //  subject: PDFサブタイトル
    //  keywords: PDFキーワード
    //  encryption: `40`(40-bit RC4), [`128`](128-bit RC4) allow~属性を指定した場合有効
    //  password: 文書を開くパスワード
    //  ownerpassword: 権限パスワード
    //  allowprinting: `true`
    //  allowmodifycontents: `true`
    //  allowassembly: `false`
    //  allowcopy: `true`
    //  allowscreenreaders: アクセシビリティのための内容の抽出 `true`
    //  allowmodifyannotations: 注釈、フォームフィールドの入力および署名 `false`
    //  allowfillin: フォームフィールドの入力および署名 `false` 文書パスワードを付けた場合有効 allowmodifyannotationsが`true`なら`true`
  },
  table: {
    //  cols: `1`
    //  width: 数値,パーセント [`80%`]
    //  cellpadding: 全体の縦の間隔 [`0`]
    //  cellspacing: セル同士の間隔 [`0`]
    //  frame: `[void]` ,`above,below,hsides,vsides,lhs,rhs,box,border` 外枠 (内枠はtdの属性で指定)
    //  border: 枠線の幅 [`1`]
    //  bordercolor: [ページで指定されたデフォルト罫線色]
    //  bgcolor: `#FFFFFF`
    //  align: [`center`], `left, right`
    //  widths: 各列の幅 割合をカンマでつないで指定。例）`'3,4,4'`
    //  absolutex, absolutey: ページ左下を基点とする、テーブルの右上角の絶対座標
    //  font: テーブルのフォント名`"$" + エンティティの項目名`を指定することで、エンティティの内容を適用
    //  size: テーブルの文字サイズ数値
    //  style: `bold`, `italic`, `underline`, `strikethru`　複数指定の場合カンマでつなぐ。
    //  color: テーブルの文字色
  },
  tr: {
    //  font: 行のフォント名
    //  size: 行の文字サイズ数値
    //  style: `bold`, `italic`, `underline`, `strikethru` 複数指定の場合カンマでつなぐ。
    //  color: 行の文字色
  },
  td: {
    //  align: セル内横方向の配置 [`left`], `center,right`,`justifyall`
    //  valign: セル内縦方向の配置 [`top`] , `middle,bottom,baseline`
    //  colspan: 結合する列数 [`1`]
    //  rowspan: 結合する行数 [`1`]
    //  bordercolor: セルの枠線の色 [ページで指定されたデフォルト罫線色]
    //  bgcolor: セルの背景色 [`#FFFFFF`]
    //  height: セルの高さ数値。文字の折り返しなどで超える
    //  leading: 文字の改行ピッチ セル上枠と文字下部の距離 [`16`]
    //  borderwidth: セルの罫線の太さ [`1`]
    //  offsetx, offsety: セル内の表示開始座標	セル左下を基点とし、表示内容の左下の座標
    //  space: 表示文字列の文字間隔 [`0`]
    //  roundrighttop (rightbottom, lefttop, leftbottom): セルの角を丸める [`false`]
    //  roundr: セルの角を丸める際の曲率 [`1`]
    //  lefttoprightbottom, righttopleftbottom: セルに斜線 [`false`]
    //  linehscale, linevscale: セルの罫線を横、縦方向に拡大・縮小 中心からの倍率(0以上、小数点) [`1`]
    //  doubleline: セルの罫線を二重線にする [`false`]
    //  left, right, top, bottom: 左右上下の枠線 [`false`]
    //  nowrap: 改行しない。セルに収まる分のみ表示される。 [`false`]
    //  font: セルのフォント名 "$" + エンティティの項目名
    //  size: セルの文字サイズ数値
    //  style: `bold`, `italic`, `underline`, `strikethru`　複数指定の場合カンマでつなぐ。
    //  color: セルのデフォルト文字色
  },
  //p div span(改行されない)<br/>で改行 : {
  //  font: フォント名
  //  size: 文字サイズ数値
  //  style: `bold`, `italic`, `underline`, `strikethru`　複数指定の場合カンマでつなぐ。`vertical:true`の場合指定しないこと。
  //  color: 文字の色
  //  nowrap: 改行しない。セルを超えて表示される。 [`false`]
  //  hscale: 文字の横幅割合 1を基準とした割合。[`1`]
  //  vertical: 縦書き [`false`]
  //  offsetx, offsety: セル内の文字列表示開始座標	セル左下を基点とし、表示内容の左下の座標
  //},
  //ul ol li: {
  //  type: ulの場合固定文字 [`-`],  olの場合項目番号 [`1`], `A`, `a`いづれか
  //  start: olに使用。項目番号の開始文字。`1`, `A`, `a` のいずれか type未指定もしくは`1`の場合数字、 `A`, `a`の場合開始したいアルファベット
  //  symbolindent: 数値(11.0ぐらいをセットしないと重なってしまう） `true`, `false`
  //  font: シンボルのフォント
  //  size: シンボルのフォントサイズ
  //  style: `bold`, `italic`, `underline`, `strikethru`　複数指定の場合カンマでつなぐ。
  //  color: シンボルの文字色
  //  leading: 文字の改行ピッチ セル上枠と文字下部の距離を数値で指定 [`16`]
  //},
  //img (プロパティ src, width, height): {
  //  plainwidth: widthより優先される。
  //  plainheight: heightより優先される。
  //  rotation: `0`
  //  absolutex, absolutey: ページ左下を基点とする、画像の左下角の絶対座標
  //},
  //<div class="_line">: {
  //  linewidth: `1`
  //  color: `#000000`
  //  x1, y1: 開始点の座標
  //  x2, y2: 終了点の座標
  //  linedushon: 描画する線を破線にする場合、表示部分の長さ [1]
  //  linedushoff	描画する線を破線にする場合、非表示部分の長さ [0]
  //},
  //<div class="_rectangle">: {
  //  linewidth: `1`
  //  width: `0`
  //  height: `0`
  //  color: 線の色 [`#000000`]
  //  absolutex, absolutey: ページ左下を基点とし、四角形の左下角の座標
  //  linedushon: 描画する線を破線にする場合、表示部分の長さ [1]
  //  linedushoff: 描画する線を破線にする場合、非表示部分の長さ [0]
  //},
  //<div class="_roundrectangle">: {
  //  linewidth: `1`
  //  width: `0`
  //  height: `0`
  //  roundr: 角の曲率 [1]
  //  color: 線の色 [`#000000`]
  //  absolutex, absolutey: ページ左下を基点とし、四角形の左下角の座標
  //  linedushon	描画する線を破線にする場合、表示部分の長さ [1]
  //  linedushoff	描画する線を破線にする場合、非表示部分の長さ [0]
  //},
  //<div class="_circle">: {
  //  linewidth: `1`
  //  absolutex, absolutey: ページ左下を基点とし、円の左下角の座標を指定。
  //  radius: 円の半径
  //  linedushon	描画する線を破線にする場合、表示部分の長さ [1]
  //  linedushoff	描画する線を破線にする場合、非表示部分の長さ [0]
  //  color: 線の色 [`#000000`]
  //}
}
