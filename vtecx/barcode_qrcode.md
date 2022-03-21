## バーコード
### Style for <div class="_barcodeEAN"> バーコードJAN(EAN、UPC)規格
value: バーコードに表示する値 [`4512345678901`]
height: `30`
size: 文字サイズ [`10`]
width: `0.75`
font: フォント名 文字を表示しない場合"null"を指定する。

### Style for <div class="_barcodeNW7"> NW-7（CODABAR）規格
同上
startstop: スタートストップ文字の有無 [`true`]

### Style for <div class="_barcode39"> code39規格
同上
extended: 拡張 [`true`]

### Style for <div class="_barcode128"> code128規格
同一番上
codetype	コードタイプ "UCC"（CODE128_UCC規格）または"RAW"（CODE128_RAW規格）を指定。それ以外はCODE128規格。

### Style for <div class="_qrcode"> QRコード
同一番上
version: 型番（シンボルの大きさ） [`0`]～`10`を指定
errorcorrectionlevel: 誤り訂正レベル `L`(コードの約7%を復元可能), [`M`](15%), `Q`(25%), `H`(30%)のいずれか
cellsize	セルのサイズ(pixel) [`1`]～`4`
margin	余白(pixel) [`0`]～`32`
