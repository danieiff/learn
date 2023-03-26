- VIM -c "argdo %s/ABC/DEF/ge | update" *.txt

### motion
)     N  )            N センテンス(文)分、先に進む
(     N  (            N センテンス分、前に戻る
}     N  }            N パラグラフ(段落)分、先に進む
{     N  {            N パラグラフ分、前に戻る
]]    N  ]]           N セクション(章)分、先に進み、その先頭に移動
[[    N  [[           N セクション(章)分、前に戻り、その先頭に移動
][    N  ][           N セクション(章)分、先に進み、その末尾に移動
[]    N  []           N セクション(章)分、前に戻り、その末尾に移動
[(    N  [(           N 個目の呼応していない '(' まで戻る
[{    N  [{           N 個目の呼応していない '{' まで戻る
[m    N  [m           N 個前のメソッドの先頭まで戻る(Java用)
[M    N  [M           N 個前のメソッドの末尾まで戻る(Java用)
])    N  ])           N 個目の呼応していない ')' まで進む
]}    N  ]}           N 個目の呼応していない '}' まで進む
]m    N  ]m           N 個先のメソッドの先頭まで進む
]M    N  ]M           N 個先のメソッドの末尾まで進む
[star N  [*           N 個前のコメントの先頭まで戻る
]star N  ]*           N 個先のコメントの末尾まで進む

`a       `{a-z}       編集中のファイルのマーク{a-z} に移動
`A       `{A-Z}       任意のファイルのマーク{A-Z} に移動
`0       `{0-9}       vimが前回終了した時の場所に移動
``       ``           直前のジャンプコマンドの前の場所に移動
`quote   `"           前回このファイルを編集した時の場所に移動
`[       `[           直前に繰作もしくはプットした文字列の先頭に移動
`]       `]           直前に繰作もしくはプットした文字列の末尾に移動
`<       `<           (直前の)ビジュアルエリアの先頭に移動
`>       `>           (直前の)ビジュアルエリアの末尾に移動
`.       `.           このファイルで最後に変更した場所に移動
'        '{a-zA-Z0-9[]'"<>.}
                        ` と同じだが、その行の先頭の非空白文字まで移動する
                        点が異なる
:marks  :marks        現在設定されているマークを一覧表示
CTRL-O  N  CTRL-O     ジャンプリストの N 番目に古い場所に移動
CTRL-I  N  CTRL-I     ジャンプリストの N 番目に新しい場所に移動
:ju     :ju[mps]      ジャンプリストを一覧表示

% matching parence

gJ same `J` with no space 

<Del> N  <Del>        カーソル位置及びその後ろの N 文字を削除
X     N  X            カーソル位置の前の N 文字を削除

]p      N  ]p         pと同じだが、インデントを現在行に合せる
[p      N  [p         Pと同じだが、インデントを現在行に合せる
gp      N  gp         pと同じだが、挿入した文字列の後にカーソルを移動
gP      N  gP         Pと同じだが、挿入した文字列の後にカーソルを移動

~       N  ~          N 文字分の英文字の大文字/小文字を変換し、カーソルを
                        移動
v_~        {visual}~  ビジュアルモードで選択された範囲の大文字/小文字を変換
g~{motion} {motion}で指定した範囲の大文字/小文字を変換

### tag
NOT USED
### scroll
z<CR>
z-
### Insert mode
<C-c> exit insert mode (Not trigger InsertLeave)

i_<S-Left>    shift-left/right  １単語ごと左右に移動
i_<S-Up>      shift-up/down     １画面ごと前後に移動
i_<End>       <End>             その行の最終桁に移動
i_<Home>      <Home>            その行の先頭桁に移動

i_<NL>        <NL> or <CR> or CTRL-M or CTRL-J
                                  改行して、新しい行を作成
i_CTRL-E      CTRL-E            カーソル位置の直下の行の内容を１文字挿入
i_CTRL-Y      CTRL-Y            カーソル位置の真上の行の内容を１文字挿入

i_CTRL-A      CTRL-A            直前に挿入した文字列をもう一度挿入
i_CTRL-@      CTRL-@            直前に挿入した文字列をもう一度挿入し、挿入
                                  モードから復帰
i_CTRL-R      CTRL-R {register} 指定のレジスタの内容を挿入

i_CTRL-N      CTRL-N            カーソルの前にあるキーワードと合致する単語
                                  を順方向に検索して挿入
i_CTRL-P      CTRL-P            カーソルの前にあるキーワードと合致する単語
                                  を逆方向に検索して挿入
i_CTRL-X      CTRL-X ...        カーソルの前にある単語をいろんな方法で補完
                                  する

i_<BS>        <BS> or CTRL-H    カーソルの前の１文字を削除
i_<Del>       <Del>             カーソル位置の１文字を削除
i_CTRL-W      CTRL-W            カーソル位置の１単語を削除
i_CTRL-U      CTRL-U            現在行で入力した全部の文字を削除
i_CTRL-T      CTRL-T            'shiftwidth' での指定分のインデントを現在行
                                  の行頭に挿入
i_CTRL-D      CTRL-D            'shiftwidth' での指定分のインデントを現在行
                                  の行頭から削除
i_0_CTRL-D    0 CTRL-D          現在行の全インデントを削除
i_^_CTRL-D    ^ CTRL-D          現在行の全インデントを削除。但し、次の行の
                                  インデントには影響しない

### Ex command
- :[range] luado {body} (Run "function (line, linenr) {body} end" to each lines)
- :[range] luafile {file} (Run script (line number range))

:r [file] / :r! [command]
Insert file content/cmd output to after cursor position

c_CTRL-G      CTRL-G             'incsearch' が有効時、次のマッチへ
c_CTRL-T      CTRL-T             'incsearch' が有効時、前のマッチへ
:history      :his[tory]         コマンドライン履歴を表示
c_CTRL-K      CTRL-K {char1} {char2}
                                   ダイグラフを入力する(Q_di参照)
c_CTRL-R      CTRL-R {register}  レジスタの内容を挿入する

c_<Left>      <Left>/<Right>     カーソルを左右に移動
c_<S-Left>    <S-Left>/<S-Right> カーソルを単語単位で左右に移動
c_CTRL-B      CTRL-B/CTRL-E      カーソルを行頭、行末に移動

c_<BS>        <BS>               カーソルの直前の文字を削除
c_<Del>       <Del>              カーソル位置の文字を削除
c_CTRL-W      CTRL-W             カーソルの直前の文字を削除
c_CTRL-U      CTRL-U             全文字を削除

### Pattern
任意の１文字に一致    .       \.
                                  行頭に一致    ^       ^
                                 <EOL>に一致    $       $
                            単語の先頭に一致    \<      \<
                            単語の末尾に一致    \>      \>
                    指定の範囲の１文字に一致    [a-z]   \[a-z]
                指定の範囲にない１文字に一致    [^a-z]  \[^a-z]
                          識別子の文字に一致    \i      \i
                上の条件から数字を除いたもの    \I      \I
                        キーワード文字に一致    \k      \k
                上の条件から数字を除いたもの    \K      \K
              ファイル名(で使える)文字に一致    \f      \f
                上の条件から数字を除いたもの    \F      \F
                          表示可能文字に一致    \p      \p
                上の条件から数字を除いたもの    \P      \P
                            空白文字類に一致    \s      \s
                        空白文字類以外に一致    \S      \S

                                 <Esc>に一致    \e      \e
                                 <Tab>に一致    \t      \t
                                  <CR>に一致    \r      \r
                                  <BS>に一致    \b      \b

            直前に指定したatomと0回以上一致     *       \*
            直前に指定したatomと1回以上一致     \+      \+
      直前に指定した文字と0回もしくは1回一致    \=      \=
            直前に指定した文字と2回〜5回一致    \{2,5}  \{2,5}
                       2種類の正規表現を列記    \|      \|
          パターンをグループ化してatomとする    \(\)    \(\)

  [num]       [num] 行下の１桁目
    +[num]      [num] 行下の１桁目
    -[num]      [num] 行上の１桁目
    e[+num]     一致した文字列の最後から [num] 桁右
    e[-num]     一致した文字列の最後から [num] 桁左
    s[+num]     一致した文字列の先頭から [num] 桁右
    s[-num]     一致した文字列の先頭から [num] 桁左
    b[+num]     上の s[+num] の別名 (begin の b)
    b[-num]     上の s[-num] の別名 (begin の b)
    ;{search-command}   次の{search-command}を実行する

### 
!        N  !{motion}{command}<CR>
                        {motion}で指定した範囲を{command}の結果出力に置き換え
!!       N  !!{command}<CR>
                        N 行を{command}の結果出力に置き換え
v_!         {visual}!{command}<CR>
                        ビジュアルモードで選択された範囲を{command}の結果出力
                        に置き換え
:range!  :[range]! {command}<CR>
                        [range] の範囲を{command}の結果出力に置き換え
=        N  ={motion}
                        {motion}で指定した範囲を'equalprg'の結果出力に置き換え
==       N  ==        N 行を'equalprg'の結果出力に置き換え
v_=         {visual}=
                        ビジュアルモードで選択された範囲を'equalprg'の結果出力
                        に置き換え
:s       :[range]s[ubstitute]/{pattern}/{string}/[g][c]
                        [range]の範囲の{pattern}を{string}に置換する
                        [g]を指定すると、見つかった全{pattern}を置換
                        [c]を指定すると、各置換を確認する
:s       :[range]s[ubstitute] [g][c]
                        直前の ":s" を新たな範囲とオプションで繰り返す
&           &         直前の ":s" を現在行について繰り返す (オプションなし)

### 
v_as     N  as        "a sentence" を選択
v_is     N  is        "inner sentence" を選択
v_ap     N  ap        "a paragraph" を選択
v_ip     N  ip        "inner paragraph" を選択
v_ab     N  ab        "a block" ("[(" ～ "])" の範囲) を選択
v_ib     N  ib        "inner block" ("[(" ～ "])" の範囲) を選択
v_aB     N  aB        "a Block" ("[{" ～ "]}" の範囲) を選択
v_iB     N  iB        "inner Block" ("[{" ～ "]}" の範囲) を選択
v_a>     N  a>        "a <> block" を選択
v_i>     N  i>        "inner <> block" を選択
v_at     N  at        "a tag block" (<aaa> ～ </aaa>)を選択
v_it     N  it        "inner tag block" (<aaa> ～ </aaa>)を選択

### 
q           q{a-z}    入力された文字群をレジスタ{a-z}に記録
q           q{A-Z}    入力された文字群をレジスタ{a-z}に追加して記録
q           q         記録を終了
@        N  @{a-z}    レジスタ{a-z}の内容を N 回実行
@@       N  @@        直前の@{a-z} を N 回実行
:@          :@{a-z}   レジスタ{a-z}の内容をExコマンドとみなして、N回実行
:@@         :@@       直前の:@{a-z} を N 回実行
:g          :[range]g[lobal]/{pattern}/[cmd]
                        [range]の中で、指定の{pattern}に合致する各行に対して
                        [cmd]コマンド(デフォルトでは ":p")を実行する
:g       :[range]g[lobal]!/{pattern}/[cmd]
                        [range]の中で、指定の{pattern}に合致**しない**各行に
                        対して[cmd]コマンド(デフォルトでは ":p")を実行する

### quickfix
:cc           :cc [nr]        [nr]番のエラーを表示(省略すると再表示)
:cnext        :cn             次のエラーを表示
:cprevious    :cp             １つ前のエラーを表示
:clist        :cl             全エラーの一覧を表示
:cfile        :cf             'errorfile' からエラーを読み込む
:cgetbuffer   :cgetb          :cbufferと同様だが最初のエラーにジャンプしない
:cgetfile     :cg             :cfileと同様だが最初のエラーにジャンプしない
:cgetexpr     :cgete          :cexprと同様だが最初のエラーにジャンプしない
:caddfile     :caddf          エラーファイルから現在のquickfixリストにエラー
                                を追加する
:caddexpr     :cad            式から現在のquickfixリストにエラーを追加する
:cbuffer      :cb             バッファ内のテキストからエラーを読み込む
:cexpr        :cex            式からエラーを読み込む
:cquit        :cq             ファイルを保存せずに、(コンパイラに)エラーコー
                                ドを戻して終了する
:make         :make [args]    makeする。エラーを開き最初のコンパイルエラー
                                にジャンプ
:grep         :gr[ep] [args]  'grepprg' を実行し、合致する最初の行にジャンプ

### Window
CTRL-W__      CTRL-W _                現在のウィンドウの高さを変更する
                                        (既定値: 可能な限り高く)

CTRL-W_<      CTRL-W <                現在のウィンドウの幅を減らす
CTRL-W_>      CTRL-W >                現在のウィンドウの幅を増やす
CTRL-W_bar    CTRL-W |                現在のウィンドウの幅を変更する
                                        (既定値: 可能な限り広く)
CTRL-W_r      CTRL-W r                ウィンドウを下側にローテートする
CTRL-W_R      CTRL-W R                ウィンドウを上側にローテートする
CTRL-W_x      CTRL-W x                現在のウィンドウを次のウィンドウと
                                        入れ換え

CTRL-W_n      CTRL-W n  or  :new      新たな空ウィンドウを作成
CTRL-W_q      CTRL-W q  or  :q[uit]   編集を終了しウィンドウを閉じる
CTRL-W_c      CTRL-W c  or  :clo[se]  バッファを隠しウィンドウを閉じる
CTRL-W_o      CTRL-W o  or  :on[ly]   画面を現在ウィンドウ１つだけにする

CTRL-W_]      CTRL-W ]                ウィンドウを分割し、カーソル下のタグ
                                        にジャンプ
CTRL-W_f      CTRL-W f                ウィンドウを分割し、カーソル下のファ
                                        イルにジャンプ
CTRL-W_^      CTRL-W ^                ウィンドウを分割し、別ファイルにジャ
                                        ンプ

:sfind        :sf[ind] {file}         ウィンドウを分割し、{file}を 'path'
                                        中で探し、それを編集

### 
:up     :[range]up[date][!]           変更されていれば、上書き保存
:wall   :wa[ll][!]                    変更のある全バッファを上書き保存

ZQ         ZQ                 ":q!" と同じ

:xall   :xa[ll][!]  or :wqall[!] 変更のある全バッファを保存して終了

<C-z>

:pwd
:cd
:file (rename) (file info)
:files (all files)
gf (edit the file in which path the cursor is on )

CTRL-L           CTRL-L       画面の再描画
CTRL-G           CTRL-G       現在の(パス名＋)ファイル名とカーソル位置を
g_CTRL-G         g CTRL-G     カーソル桁数、行数、単語数、文字数を表示

U          U          行全体への変更を取り消す
:undolist
:earlier/later [times]
:undo [change number] (jump to [change number] node)
g-/+ (undo/redo) -> move inside latest used branch
g;/, 変更リスト中の [count] 個前/後

### 
:range        ,               ２つの行の範囲
:range        ;               同上。最初の指定行から次の指定範囲まで

:range        {number}        ファイル中の行番号 
:range        .               現在行
:range        $               ファイルの最終行
:range        %               1,$ と同じ(＝ファイル全体)
:range        *               '<,'> と同じ(＝ビジュアルモードの選択範囲)
:range        't              マーク t の行
:range        /{pattern}[/]   {pattern} に合致する行の次の行
:range        ?{pattern}[?]   {pattern} に合致する行の前の行

:range        +[num]          直前の行指定(デフォルト:1)に[num]を加算した
                                もの
:range        -[num]          直前の行指定(デフォルト:1)から[num]を減算し
                                たもの


### Term
-- :call jobstart('nvim -h', {'on_stdout':{j,d,e->append(line('.'),d)}})
