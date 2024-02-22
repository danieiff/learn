-i, --ignore-case
-s, --case-sensitive
-w, --word-regexp	単語とみなす。 /\b(?:foo)\b/
-S, --smart-case	小文字なら /foo/i で大文字が含まれるなら /Foo/
-x, --line-regexp	1行分マッチさせる。 foo は /^foo$/
-U, --multiline	複数行にまたがれる。 a\nb には a\nb でマッチする
--multiline-dotall	-U と合わせて指定すると a\nb に a.b でマッチする
-F, --fixed-strings	正規表現としない
結果表示カスタマイズ
--no-heading	ファイル名をマッチした行と一緒に表示する (必須)
-l, --files-with-matches	マッチしたファイル名だけ列挙する
-m, --max-count <N>	ファイルごとに表示をN行に制限する。便利。
-n, --line-number	行番号を表示する (デフォルト)
-H, --with-filename	1つのファイルを指定しているときでもファイル名を表示する
--trim	表示の際に左側のスペースを取る。lstrip 相当
-q, --quiet	何も表示しない
--heading	ファイル名を一緒に表示しない (デフォルトかつ不便)
--column	カラム位置も表示する。ファイル名:行:カラム
-p, --pretty	--color always --heading --line-number の一括指定。less 用
--vimgrep	1行で複数回マッチしたら複数行表示する。vim専用(?)

-c, --count	マッチ行数表示
--count-matches	マッチ個数を表示する

長すぎる一行を途中で切る
-M, --max-columns <N>	N 文字以上なら一行まるごと省略する
--max-columns-preview	N 文字分は表示する
--max-columns だけだと一行がまるごと省略メッセージに置き換わってしまう
--max-columns-preview も指定すると「途中で切る」になる
*.min.js にマッチして大変な目に合わないよう初期設定しておく

-g, --glob <GLOB>...	対象を GLOB 形式で絞る。!なら逆に捨てる
--glob-case-insensitive	--glob のとき大小文字の区別をしない
--iglob	--glob --glob-case-insensitive と同じ
rg foo *.rb と書いても GLOB 形式だけど、それは実行前にシェルが展開するだけなので、探索しながら絞る -g とは動作が異なる。

-L, --follow	シンボリックリンク先を追う
-z, --search-zip	圧縮ファイルの中も見る

ファイルサイズや深さで制限する
--max-filesize <N+SUFFIX?>	10M なら 10MB 以下のファイルだけ見る
--max-depth <N>	ディレクトリN階層まで。1:自分 2:子 3:孫

除外ルールを緩める
-u, --unrestricted	--no-ignore と同じ
-uu	--no-ignore --hidden と同じ
-uuu	--no-ignore --hidden --binary と同じ
--no-ignore	ignore 的なやつ全部無視。-u と同じ
-., --hidden	ドットで始まる隠れてるやつも見る
マッチしなかったら -u -uu -uuu と増やす。それだけ覚えておけばいい。

ファイルのグループ化
--type-list	事前にグループ化されている種類を確認する
-t, --type <TYPE>...	-t ruby なら Ruby に関連するファイルを探す
-T, --type-not <TYPE>...	-T ruby なら Ruby に関連しないファイルを探す
--type-add <TYPE_SPEC>...	foo:*.bar なら foo グループに *.bar を登録
--type-clear <TYPE>...	削除する
コマンドラインで使うのは -t ぐらい
他はだいたい初期設定ファイルで使う

バイナリファイルも見る
--binary	バイナリファイルも見る。中身の表示は控える
-a, --text	すべてをテキストと見なしてバイナリの中身もかまわず出力する
どちらを指定してもバイナリファイルを見る
--text は端末が壊れるので忘れていい

文字コードがらみ
-E, --encoding <E>	Shift_JIS のときは -E shift_jis とする
--crlf	改行が \r\n なときでも $ が行末にマッチする
ripgrep によると正規表現は本来 $ で \r\n にマッチするべきらしい
でも Ruby は $ が \r\n にマッチしない
しかしライブラリが対応してないので対応するまで --crlf で吸収しているとのこと
--crlf オプションを使わない場合は \r?$ と書かないといけない
結局 Windows なファイルには -E shift_jis --crlf としないといけない
それか --pre で nkf -w する？ (のはやめたほうがよさそう)

事前に別のコマンドを噛ます
--pre <COMMAND>	事前に COMMAND を噛ます。Excelをテキスト化するなど。
--pre-glob <GLOB>...	--pre で指定した COMMAND に送れるファイルを絞る '*.xlsx' など
バイナリ判定する前に COMMAND に渡るので --binary の有無は気にしなくてよい
COMMAND で受け付けているのに無反応な場合 --pre-glob に指定し忘れている
--pre-glob を指定しなくても動くけどすべてのファイルが渡って遅くなってしまう

上下余分に表示する
-B, --before-context <N>	マッチした行の上 N 行も表示する
-A, --after-context <N>	マッチした行の下 N 行も表示する
-C, --context <N>	マッチした行の上下 N 行も表示する
--context-separator <SEP>	塊と塊の間の -- を変更する
--field-context-separator <SEP>	余分に表示した行の横の境目の - を変更する

ファイル名の並び替え
--sort <SORTBY>	正順
--sortr <SORTBY>	逆順
選択肢 none path modified accessed created

--files	対象ファイル列挙 --debug	どの設定ファイル有効？ --trace	どこで何がマッチした？

統計表示
--stats	何件中何個マッチしたかなどの情報を最後に表示する
--json	JSON 形式で表示する
--stats の出力をプログラムで読み取るなら --json で JSON 化する
--json は --stats 専用ってわけじゃない

ブロック毎に出力するか？ 一行毎に出力するか？
--block-buffered	ブロック毎に出力する (デフォルト)
--line-buffered	一行毎に出力する
単に端末に表示するなら --block-buffered の方が速いけど tailf -f production.log | rg foo | foo bar のような行指向でパイプ処理する場合、ブロック毎だと一行が途中で分断されるため --line-buffered オプションをつけろということらしい。

しかし、実際試したところブロック毎であっても行の分断を観測できなかったので本当に必要かはよくわかってない。とりあえず行指向なパイプ処理のときは安全のために --line-buffered をつけておいた方がよさそう、ぐらいの認識。

色
--color <WHEN>	never なら色付けしない
--colors <COLOR_SPEC>...	match:fg:cyan ならマッチした部分を水色にする

正規表現関連
-P, --pcre2	PCRE2 に変更する。--engine pcre2 と同じ
--pcre2-version	使っている PCRE2 のバージョンを表示する
--engine auto なら必要なときだけ PCRE2 に切り替わる。

もしかしてフィルタ用？
-r, --replace <TEXT>	マッチ箇所を置換する
--passthru	マッチしてない部分も全部表示する
--replace は後方参照が使えない
それに元のファイルを置換してくれるわけでもない
単体では何の役にも立たないが、--passthru とシナジーがある
さらに --no-line-number と --no-filename を組み合わせると簡易フィルタになる
例: rg '.*password.*' -r '[FILTERED]' --passthru -NI

何かに使えそうで何に使うかわからなかったやつ
-o, --only-matching	マッチした行ではなくマッチした箇所だけ表示する
-b, --byte-offset	-o のときマッチした箇所のオフセットも表示する
--byte-offset は --column と似ているが行頭からではなくファイルの先頭からのオフセット

正規表現 \R が効かない
これも PCRE2 にすると効く
とはいえ foo\n に foo\R がマッチしない (なんで？)
よくわからないが --crlf オプションがあると foo\R はマッチした
とりあえず --crlf は常に有効にしといた方がよさそう
便利とはいえ遅いので常に PCRE2 にはしたくない
--engine auto にしておくと必要なときだけ PCRE2 に切り替わる。

プリプロセッサを PDF にも対応させたのに PDF が来ない
--pre-glob での指定を忘れている
もし --pre-glob=*.xlsx のままだと *.pdf は来ない
--pre-glob=*.{xlsx,pdf} とする
--type-add するときの include とは？
rg --type-add web:include:html,css -t web foo

既存の html と css のグループをまとめるという意味。

rg --type-list | rg -N '^(html|css):'
# html: *.ejs, *.htm, *.html
# css: *.css, *.scss

となるので web:include:html,css は、こう書くのと結果的には同じ。

rg --type-add 'web:*.{ejs,htm,html,css,scss}' -t web foo

ときどきファイル名が表示されない理由
ファイルを1件指定したときはファイル名を表示しないようになっているから
自明だから表示する必要ないだろうと判断されている
素の grep でも同じ
これは指定するファイル数が変動する場合に困る
1件でも2件でも同じように読み取りたいプログラムがあったときおかしくなる
常にファイル名を表示するには --with-filename とする
ただし初期設定ファイルで有効にしてしまうと helm-ag がダサくなる
--binary オプションが常に効いている？
--binary はバイナリーファイルも読むオプション
なので rg --binary PNG とすると png ファイルにマッチする
ヘッダ内の PNG 文字列がマッチする
ところが rg PNG foo.png としても --binary を指定してないのにマッチする
これは探したファイルと明示的に指定したファイルとでは扱いが異なるため
ファイルを限定して指定したのにそれをわざわざ省く必要はないだろうと判断される
なので --binary の有無に関係なく foo.png は対象になる
このように従来の不親切なツールに慣れていると親切な仕様に戸惑うことがある
--text オプションを指定したのにバイナリーファイルも見ている
勘違いしやすいけど --text はテキストだけを見るオプションではない
正しくはすべてをテキストとして扱うやばいオプション
なのでバイナリーファイルもテキストファイルとして扱う
--no-require-git とは？
.git	--no-require-git	Gitのグローバル除外ルール	
ある	なし	効く	
ない	なし	効かない	
ない	指定	効く	← .git がないのに効く
デフォルトの挙動は、.git ディレクトリがないのに勝手に Git のグローバル除外ルールを適用するのは利用者も望んでないだろうから、.git ディレクトリがあるときだけ Git のグローバル除外ルールを有効にしよう、となっている。

そこであるとき、Git で管理してないディレクトリで作業中に、Git のグローバル除外ルールが効いてないから不便だと感じて、Git のグローバル除外ルールを適用させるためだけに mkdir .git したとする。

その mkdir .git をやらなくても適用するのが --no-require-git オプションになる。


実用例
node_modules 以下も探したい
rg foo -u

node_modules は普通 Git 管理外になっているので -u をつける
それでもでてこなかったら -uu にする
それでもでてこなかったら -uuu にする
.vuepress/config.js を対象に含める
rg G-XXXXXXXXXX -.

ドットで始まるディレクトリはデフォルトで除外されているので -. をつける。

*.min.js にマッチしてしまい端末が大変なことになったときの応手
Command	意味
-g '!*.min.js'	*.min.js は除外する
-T minified	*.min.js っぽいやつは除外する
--max-columns 100	表示する一行の文字数を制限する
minified グループには *.min.* なやつらがあらかじめ登録されている
--max-columns を指定するときは --max-columns-preview も一緒に指定する
指定したカラムまでは表示されるようになる
マッチしすぎるときの応手
コマンド	意味
rg foo -w	単語にしてみる
rg foo -g '*.rb'	拡張子で絞る
rg foo -g '!*.js'	絞るんじゃなくていらない方を除外する
rg foo -t ruby	グループで絞る
rg foo -T js	いらない方のグループを除外する
rg foo -g '*foo*'	foo が含まれるファイル名に絞る
rg foo -m 3	1つのファイルにつき表示は3行だけにする
rg foo -c	ファイル名と、マッチした行数だけにする
rg foo -l	もうファイル名だけでいい
rg foo --max-depth 2	ファイル名も多いので孫ディレクトリは見ない
rg foo -q	何も表示しない (マッチの有無は $? で判断できる)
拡張子が png なのにヘッダに PNG が含まれない偽画像ファイルを探す
rg --files-without-match --binary -g '*.png' PNG

WEB で表示するために検索結果を JSON 形式で用意する rg --stats --json foo
--stats 検索に要した時間なども含める

さくっと結果を less する rg -p foo | less -R

-p オプションで less に合わせた見やすい表示になる
less の -R は色を反映するオプション
ログを見るとき秘密の情報をフィルタする
tailf production.log | rg '.*password.*' -r '[FILTERED]' --passthru -NI

~/bin/rg-preprocessor foo.xlsx などとしてテキスト変換されるのを確認する。次に --pre と --pre-glob を設定する。コマンドラインで毎回書くのは大変なので設定ファイルに書いておく。

~/.ripgreprc
# バイナリをテキスト化するコマンドを指定する。 ~/ とか使うと動かない。
--pre=/Users/alice/bin/rg-preprocessor

# --pre のコマンドに渡すファイルを絞る
--pre-glob=*.{xlsx,pdf}
--pre-glob=*.{png,jpg,apng,webp,gif}
--pre-glob=*.{wav,mp3,m4a,ogg}
--pre-glob=*.{mp4,mov,avi,webm}

例: xlsxから特定の行を検索する
rg 商品A
# file1.xlsx:1:商品A-1,1980
# file1.xlsx:2:商品A-2,4980

例: PDFのページ数を確認する
rg 'Page Count'
# file1.pdf:18:Page Count : 4
# file2.pdf:18:Page Count : 6

# 後方参照などを使ったときだけ正規表現ライブラリを PCRE2 に変更する
--engine=auto

# 端末が死なないように長すぎる一行を切る
--max-columns=128

# 一行を切ったとき切った前の部分は表示する
--max-columns-preview

# ファイル名だけ別に表示するのではなくコンテンツと一緒に一行で表示する
--no-heading

# ファイルを1件指定したときファイル名がわかりきっていても省略せずに表示する
# ・これを常時有効にすると helm-do-ag-this-file のときもファイル名が表示されて面倒なことになる
# --with-filename

# *.min.css, *.min.html, *.min.js を除外する
--type-not=minified
