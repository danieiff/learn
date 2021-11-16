バーコードJAN(EAN、UPC)規格

<div class="_barcodeEAN">でJAN(EAN、UPC)規格のバーコードを描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
value	バーコードに表示する値	4512345678901	数字
height	高さ	30	数値
size	文字のサイズ	10	数値
width	幅	0.75	数値
font	フォント名	(なし)	文字を表示しない場合、"null"を指定する。
バーコードNW-7（CODABAR）規格

<div class="_barcodeNW7">でNW-7（CODABAR）規格のバーコードを描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
value	バーコードに表示する値	4512345678901	文字列
height	高さ	30	数値
size	文字のサイズ	10	数値
width	幅	0.75	数値
startstop	スタートストップ文字の有無	true	true/false
font	フォント名	(なし)	文字を表示しない場合、"null"を指定する。
バーコードcode39規格

<div class="_barcode39">でcode39規格のバーコードを描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
value	バーコードに表示する値	4512345678901	文字列
height	高さ	30	数値
size	文字のサイズ	10	数値
width	幅	0.75	数値
startstop	スタートストップ文字の有無	true	true/false
extended	拡張	true	true/false
font	フォント名	(なし)	文字を表示しない場合、"null"を指定する。
バーコードcode128規格

<div class="_barcode128">でcode128規格のバーコードを描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
value	バーコードに表示する値	4512345678901	文字列
height	高さ	30	数値
size	文字のサイズ	10	数値
width	幅	0.75	数値
codetype	コードタイプ	(なし)	"UCC"（CODE128_UCC規格）または"RAW"（CODE128_RAW規格）を指定。それ以外はCODE128規格。
font	フォント名	(なし)	文字を表示しない場合、"null"を指定する。
QRコード

<div class="_qrcode">でQRコードを描画します。style属性には以下を指定できます。

プロパティ	内容	初期値	指定方法
value	バーコードに表示する値	4512345678901	文字列
height	高さ	30	数値
width	幅	0.75	数値
version	型番（シンボルの大きさ）	0	0～10を指定
errorcorrectionlevel	誤り訂正レベル	"H"	"L"(コード語の約7%を復元可能), "M"(15%), "Q"(25%), "H"(30%)のいずれかを指定
cellsize	セルのサイズ(pixel)	1	1～4を指定
margin	余白(pixel)	0	0～32を指定
