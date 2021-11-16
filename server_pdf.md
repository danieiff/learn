### PDF
#### PDF出力
`vtecxapi.toPdf(pages,html,outfilename)`
pages: ページ数
html: PDFの生成元となるHTML
outfilename: ファイル名
/pdf/pdfstyles.tsはPDFのスタイルシートファイルです
:::details 実装例
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
#### PDFスタイルシート
ページ構造
PDFのページは以下のように３つのレベル要素により構成されます。
第一レベル要素はすべて左下点を基準とする絶対座標で指定することができます。
第二レベル要素は第一レベル要素からの相対位置座標となります。

基底要素
htmlタグ：<html>
bodyタグ：<body>
ページタグ：<div class="_page">
第一レベル要素
テーブル：<table> <tr> <td>
注：<table>の子要素に<table>を指定することはできません。
イメージ：<img>
図形：<div class="_rectangle">、<div class="_line">
第二レベル要素
ブロックレベル要素：<div>、<p>
リスト：<ul>、<ol>
インライン要素：<span>
リンク：<a>
イメージ：<img>
改行：<br>
pageタグ

<div class="_page">タグ（以下、pageタグとします）には、ページの大きさや向き、余白サイズ、暗号化や署名などを設定できます。styleで指定できる属性には以下のものがあります。

プロパティ	内容	初期値	指定方法
pagesize	ページサイズ	A4	A0～A10, B0～B5, HAGAKI, NOTE, LEGAL, ARCH_E, ARCH_D, ARCH_C, ARCH_B, ARCH_A, FLSA, FLSE, HALFLETTER, _11X17, LEDGER のいずれか。
orientation	ページの向き	portrait	portrait(縦長)かlandscape(横長)のいずれか。
left, right, top, bottom	左、右、上、下の余白	36	数値
nodata	ページ制御の際、オフセットはカウントされるがエンティティのインデックスはカウントされない。	(なし)	"nodata"のみ記述
footer	ページ数表示	false	true/false
fontsize	ページ全体のデフォルト文字サイズ。ただし、p、span、div、chunk、vchunk、paragraph、a、liタグに囲まれた文字のみ適用される。tdタグに記述された文字列には適用されない。	12	数値
color	ページ全体のデフォルト文字色。ただし、p、span、div、chunk、vchunk、paragraph、a、liタグに囲まれた文字のみ適用される。tdタグに記述された文字列には適用されない。	#000000	#xxxxxx
linecolor	ページ全体のデフォルト罫線色	#000000	#xxxxxx
font	ページ全体のデフォルトフォント	HeiseiKakuGo-W5	フォント名(HeiseiKakuGo-W5,HeiseiMin-W3,KozMinPro-Regularのうちいずれか )
title	PDF文書のタイトル	(なし)	文字列
author	PDF文書の作成者	(なし)	文字列
subject	PDF文書のサブタイトル	(なし)	文字列
keywords	PDF文書のキーワード	(なし)	文字列
encryption	暗号化	(なし)	40：「40-bit RC4」で暗号化、128：「128-bit RC4」で暗号化　パスワードおよび文書に関する制限（allowで始まる属性）を指定した場合暗号化される。このとき本項目を指定していない場合は128。
password	文書を開くパスワード（PDFファイルを開く(参照する)際に入力するパスワード。）	(なし)	文字列
ownerpassword	権限パスワード（PDFファイルのセキュリティ設定を変更する際に入力するパスワード。）	(なし)	文字列
allowprinting	印刷	true	true：印刷可、false：印刷不可
allowmodifycontents	文書の変更	true	true：文書編集可、false：文書編集不可
allowassembly	文書アセンブリ　ページの挿入/削除/回転、しおりとサムネールの作成の可否。	false	true：変更可、false：変更不可
allowcopy	内容のコピーと抽出	true	true：コピー可、false：コピー不可
allowscreenreaders	アクセシビリティのための内容の抽出　視覚に障碍を持つユーザに対して、スクリーンリーダ(読み上げ)の利用可否。	true	true：可、false：不可
allowmodifyannotations	注釈、フォームフィールドの入力および署名	false	true：編集可、false：編集不可
allowfillin	フォームフィールドの入力および署名	false	true：入力可、false：入力不可　注）文書パスワードを付けた場合のみ有効。allowmodifyannotationsが編集可（true）の場合、trueとなる。
<table>タグ

<table>タグにより表を作ることができます。これは、行(<tr>)と列(<td>もしくは<th>)を子要素にもちます。style属性には以下を指定することができます。

プロパティ	内容	初期値	指定方法
cols	列数	1	数値
width	幅の縮尺	80%	固定の数値、またはパーセント指定
cellpadding	全体の縦の間隔	0	数値
cellspacing	セル同士の間隔	0	数値
frame	罫線	void	void,above,below,hsides,vsides,lhs,rhs,box,border のいずれか。外枠のみの指定であり、内側の線はtdタグの属性で指定。
border	枠線の幅	1	数値
bordercolor	枠線の色	ページで指定されたデフォルト罫線色	#xxxxxx
bgcolor	背景色	#FFFFFF	#xxxxxx
align	表示位置	center	center, left, right のいずれか
widths	各列の幅（どれだけのカラムを割くか）	(なし)	列数分、割合をカンマでつないで指定。例）width: 3,4,4;
absolutex, absolutey	ページ内の絶対座標	(なし)	ページ左下を基点とし、テーブルの右上角の座標を指定。
font	テーブルのデフォルトフォント名	(なし)	フォント名。"$" + エンティティの項目名を指定することで、エンティティの内容を適用できる。
size	テーブルのデフォルト文字サイズ	(なし)	数値
style	テーブルのデフォルト文字スタイル	(なし)	bold（太字）,italic（斜体）,underline（下線）,strikethru（取消線）　複数指定の場合カンマでつなぐ。
color	テーブルのデフォルト文字色	(なし)	#xxxxxx
<tr>タグ

style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
font	行のデフォルトフォント名	(なし)	フォント名
size	行のデフォルト文字サイズ	(なし)	数値
style	行のデフォルト文字スタイル	(なし)	bold（太字）,italic（斜体）,underline（下線）,strikethru（取消線）　複数指定の場合カンマでつなぐ。
color	行のデフォルト文字色	(なし)	#xxxxxx
<td>タグ

style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
align	セル内データの横方向の配置	left	left,center,right,justifyall（均等割付） のいずれか
valign	セル内データの縦方向の配置	top	top,middle,bottom,baseline のいずれか
colspan	結合する列数	1	数値
rowspan	結合する行数	1	数値
bordercolor	セルの枠線の色	ページで指定されたデフォルト罫線色	#xxxxxx
bgcolor	セルの背景色	#FFFFFF	#xxxxxx
height	セルの高さ。設定値が最低限保証され、文字の折り返しなどで超える場合はこれ以上の高さとなる。	(なし)	数値
leading	文字の改行ピッチ	16	セル上枠と文字下部の距離を数値で指定。
borderwidth	セルの罫線の太さ	1	数値
offsetx, offsety	セル内の表示開始座標	(なし)	セル左下を基点とし、表示内容の左下の座標を指定。
space	表示文字列の文字間隔	0	数値
roundrighttop, roundrightbottom, roundlefttop, roundleftbottom	セルの右上、右下、左上、左下の角を丸める	false	true/false
roundr	セルの角を丸める際の曲率	1	数値
lefttoprightbottom, righttopleftbottom	セルの左上から右下、右上から左下へ斜線を引く	false	true/false
linehscale, linevscale	セルの罫線を横、縦方向に拡大・縮小	1	中心からの倍率を指定。拡大時は1より大きな数値、縮小時は0.x。
doubleline	セルの罫線を二重線にする	false	true/false
left, right, top, bottom	左、右、上、下の枠線	false	true/false
nowrap	改行しない。セルに収まる分のみ表示される。	false	true/false
font	セルのデフォルトフォント名	(なし)	フォント名。"$" + エンティティの項目名を指定することで、エンティティの内容を適用できる。
size	セルのデフォルト文字サイズ	(なし)	数値
style	セルのデフォルト文字スタイル	(なし)	bold（太字）,italic（斜体）,underline（下線）,strikethru（取消線）　複数指定の場合カンマでつなぐ。
color	セルのデフォルト文字色	(なし)	#xxxxxx
文字列の表示

文字列を表示する場合、<p>,<div>,<span>のいずれかのタグを使用します。
上記タグで囲まなければ、デフォルトを含むレイアウト表示はされませんのでご注意ください。
<p>,<div>タグの場合、文字列表示の後に改行されます。<span>タグの場合改行されません。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
font	フォント	セル、行、テーブル、ページで指定されたデフォルトフォント	フォント名。
size	文字サイズ	セル、行、テーブル、ページで指定されたデフォルト文字サイズ	数値
style	文字編集	セル、行、テーブルで指定された文字スタイル	bold（太字）,italic（斜体）,underline（下線）,strikethru（取消線）　複数指定の場合カンマでつなぐ。vertical:trueの場合指定しないこと。
color	文字の色	セル、行、テーブル、ページで指定されたデフォルト文字色	#xxxxxx
nowrap	改行しない。セルを超えて表示される。	false	true/false
hscale	文字の横幅割合	1	1を基準とした割合。縮めるなら0.x、広げるなら1より大きな数字。
vertical	縦書き	false	true/false
offsetx, offsety	セル内の文字列表示開始座標	(なし)	セル左下を基点とし、表示内容の左下の座標を指定。
改行

改行は<br/>タグを使用します。(必ず最後にスラッシュを入れて閉じてください)

リンク

リンクは<a>タグを使用します。href属性にリンク先URLを指定してください。
<a>タグに囲む文字列は、<p>,<div>,<span>のいずれかで囲んでください。

リスト

リストは<ul>、<ol>、<li>タグを使用します。
<li>タグに囲む文字列は、<p>,<div>,<span>のいずれかで囲んでレイアウトを編集してください。シンボルは<ul>、<ol>タグでレイアウト編集できます。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
type	ulの場合固定文字。olの場合項目番号。	ulの場合 - 。olの場合 1 。	ulの場合任意の一文字。olの場合、1, A, a のいずれか。
start	olの場合に使用。項目番号の開始文字。	1, A, a のいずれか	type未指定もしくは1の場合数字。typeがA, a の場合開始したいアルファベット。
symbolindent	数値(11.0ぐらいをデフォルトでセットしないと重なってしまう）	(なし)	true/false
font	シンボルのフォント	ページで指定されたデフォルトフォント	フォント名
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