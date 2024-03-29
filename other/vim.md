- VIM -c "argdo %s/ABC/DEF/ge | update" \*.txt

### motion

) N ) N センテンス(文)分、先に進む
( N ( N センテンス分、前に戻る
} N } N パラグラフ(段落)分、先に進む
{ N { N パラグラフ分、前に戻る
]] N ]] N セクション(章)分、先に進み、その先頭に移動
[[ N [[ N セクション(章)分、前に戻り、その先頭に移動
][ N ][ N セクション(章)分、先に進み、その末尾に移動
[] N [] N セクション(章)分、前に戻り、その末尾に移動
[( N [( N 個目の呼応していない '(' まで戻る
[{ N [{ N 個目の呼応していない '{' まで戻る
[m N [m N 個前のメソッドの先頭まで戻る(Java 用)
[M N [M N 個前のメソッドの末尾まで戻る(Java 用)
]) N ]) N 個目の呼応していない ')' まで進む
]} N ]} N 個目の呼応していない '}' まで進む
]m N ]m N 個先のメソッドの先頭まで進む
]M N ]M N 個先のメソッドの末尾まで進む
[star N [* N 個前のコメントの先頭まで戻る
]star N ]\* N 個先のコメントの末尾まで進む

`a       `{a-z} 編集中のファイルのマーク{a-z} に移動
`A       `{A-Z} 任意のファイルのマーク{A-Z} に移動
`0       `{0-9} vim が前回終了した時の場所に移動
`       ` 直前のジャンプコマンドの前の場所に移動
`quote   `" 前回このファイルを編集した時の場所に移動
`[       `[ 直前に繰作もしくはプットした文字列の先頭に移動
`] `]           直前に繰作もしくはプットした文字列の末尾に移動
`< `<           (直前の)ビジュアルエリアの先頭に移動
`> `>           (直前の)ビジュアルエリアの末尾に移動
`. `.           このファイルで最後に変更した場所に移動
'        '{a-zA-Z0-9[]'"<>.}
                        ` と同じだが、その行の先頭の非空白文字まで移動する
点が異なる
:marks :marks 現在設定されているマークを一覧表示
CTRL-O N CTRL-O ジャンプリストの N 番目に古い場所に移動
CTRL-I N CTRL-I ジャンプリストの N 番目に新しい場所に移動
:ju :ju[mps] ジャンプリストを一覧表示

% matching parence

gJ same `J` with no space

<Del> N <Del> カーソル位置及びその後ろの N 文字を削除
X N X カーソル位置の前の N 文字を削除

]p N ]p p と同じだが、インデントを現在行に合せる
[p N [p P と同じだが、インデントを現在行に合せる
gp N gp p と同じだが、挿入した文字列の後にカーソルを移動
gP N gP P と同じだが、挿入した文字列の後にカーソルを移動

~ N ~ N 文字分の英文字の大文字/小文字を変換し、カーソルを
移動
v\_~ {visual}~ ビジュアルモードで選択された範囲の大文字/小文字を変換
g~{motion} {motion}で指定した範囲の大文字/小文字を変換

### tag

NOT USED

### scroll

z<CR>
z-

### Insert mode

<C-c> exit insert mode (Not trigger InsertLeave)

i*<S-Left> shift-left/right １単語ごと左右に移動
i*<S-Up> shift-up/down １画面ごと前後に移動
i*<End> <End> その行の最終桁に移動
i*<Home> <Home> その行の先頭桁に移動

i\_<NL> <NL> or <CR> or CTRL-M or CTRL-J
改行して、新しい行を作成
i_CTRL-E CTRL-E カーソル位置の直下の行の内容を１文字挿入
i_CTRL-Y CTRL-Y カーソル位置の真上の行の内容を１文字挿入

i_CTRL-A CTRL-A 直前に挿入した文字列をもう一度挿入
i_CTRL-@ CTRL-@ 直前に挿入した文字列をもう一度挿入し、挿入
モードから復帰
i_CTRL-R CTRL-R {register} 指定のレジスタの内容を挿入

i_CTRL-N CTRL-N カーソルの前にあるキーワードと合致する単語
を順方向に検索して挿入
i_CTRL-P CTRL-P カーソルの前にあるキーワードと合致する単語
を逆方向に検索して挿入
i_CTRL-X CTRL-X ... カーソルの前にある単語をいろんな方法で補完
する

i*<BS> <BS> or CTRL-H カーソルの前の１文字を削除
i*<Del> <Del> カーソル位置の１文字を削除
i*CTRL-W CTRL-W カーソル位置の１単語を削除
i_CTRL-U CTRL-U 現在行で入力した全部の文字を削除
i_CTRL-T CTRL-T 'shiftwidth' での指定分のインデントを現在行
の行頭に挿入
i_CTRL-D CTRL-D 'shiftwidth' での指定分のインデントを現在行
の行頭から削除
i_0_CTRL-D 0 CTRL-D 現在行の全インデントを削除
i*^\_CTRL-D ^ CTRL-D 現在行の全インデントを削除。但し、次の行の
インデントには影響しない

### Ex command

- :[range] luado {body} (Run "function (line, linenr) {body} end" to each lines)
- :[range] luafile {file} (Run script (line number range))

:r [file] / :r! [command]
Insert file content/cmd output to after cursor position

c_CTRL-G CTRL-G 'incsearch' が有効時、次のマッチへ
c_CTRL-T CTRL-T 'incsearch' が有効時、前のマッチへ
:history :his[tory] コマンドライン履歴を表示
c_CTRL-K CTRL-K {char1} {char2}
ダイグラフを入力する(Q_di 参照)
c_CTRL-R CTRL-R {register} レジスタの内容を挿入する

c*<Left> <Left>/<Right> カーソルを左右に移動
c*<S-Left> <S-Left>/<S-Right> カーソルを単語単位で左右に移動
c_CTRL-B CTRL-B/CTRL-E カーソルを行頭、行末に移動

c*<BS> <BS> カーソルの直前の文字を削除
c*<Del> <Del> カーソル位置の文字を削除
c_CTRL-W CTRL-W カーソルの直前の文字を削除
c_CTRL-U CTRL-U 全文字を削除

:tabe | put = execute('messages')

:sbn, :sbp open next(previous) buffer in split
:sbm (bm) next modified buf
:unh open windows per buffer

<C-b>,<C-e> == <Home>,<End> (move to the first, end of line)
<C-u> deletes lines

#### Open last closed buffer

:e # :h cmdline-special
<C-o> or :new<CR><C-o><C-o> (for when last closed buf is in the other window) :h jumplist

### Pattern

任意の１文字に一致 . \.
行頭に一致 ^ ^
<EOL>に一致 $ $
単語の先頭に一致 \< \<
単語の末尾に一致 \> \>
指定の範囲の１文字に一致 [a-z] \[a-z]
指定の範囲にない１文字に一致 [^a-z] \[^a-z]
識別子の文字に一致 \i \i
上の条件から数字を除いたもの \I \I
キーワード文字に一致 \k \k
上の条件から数字を除いたもの \K \K
ファイル名(で使える)文字に一致 \f \f
上の条件から数字を除いたもの \F \F
表示可能文字に一致 \p \p
上の条件から数字を除いたもの \P \P
空白文字類に一致 \s \s
空白文字類以外に一致 \S \S

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

[num] [num] 行下の１桁目 +[num] [num] 行下の１桁目 -[num] [num] 行上の１桁目
e[+num] 一致した文字列の最後から [num] 桁右
e[-num] 一致した文字列の最後から [num] 桁左
s[+num] 一致した文字列の先頭から [num] 桁右
s[-num] 一致した文字列の先頭から [num] 桁左
b[+num] 上の s[+num] の別名 (begin の b)
b[-num] 上の s[-num] の別名 (begin の b)
;{search-command} 次の{search-command}を実行する

\_x (x including newlines eg. \_s (tab or space including newlines))

###

! N !{motion}{command}<CR>
{motion}で指定した範囲を{command}の結果出力に置き換え
!! N !!{command}<CR>
N 行を{command}の結果出力に置き換え
v*! {visual}!{command}<CR>
ビジュアルモードで選択された範囲を{command}の結果出力
に置き換え
:range! :[range]! {command}<CR>
[range] の範囲を{command}の結果出力に置き換え
= N ={motion}
{motion}で指定した範囲を'equalprg'の結果出力に置き換え
== N == N 行を'equalprg'の結果出力に置き換え
v*= {visual}=
ビジュアルモードで選択された範囲を'equalprg'の結果出力
に置き換え
:s :[range]s[ubstitute]/{pattern}/{string}/[g][c]
[range]の範囲の{pattern}を{string}に置換する
[g]を指定すると、見つかった全{pattern}を置換
[c]を指定すると、各置換を確認する
:s :[range]s[ubstitute] [g][c]
直前の ":s" を新たな範囲とオプションで繰り返す
& & 直前の ":s" を現在行について繰り返す (オプションなし)

###

v_as N as "a sentence" を選択
v_is N is "inner sentence" を選択
v_ap N ap "a paragraph" を選択
v_ip N ip "inner paragraph" を選択
v_ab N ab "a block" ("[(" ～ "])" の範囲) を選択
v_ib N ib "inner block" ("[(" ～ "])" の範囲) を選択
v_aB N aB "a Block" ("[{" ～ "]}" の範囲) を選択
v_iB N iB "inner Block" ("[{" ～ "]}" の範囲) を選択
v_a> N a> "a <> block" を選択
v_i> N i> "inner <> block" を選択
v_at N at "a tag block" (<aaa> ～ </aaa>)を選択
v_it N it "inner tag block" (<aaa> ～ </aaa>)を選択

###

q q{a-z} 入力された文字群をレジスタ{a-z}に記録
q q{A-Z} 入力された文字群をレジスタ{a-z}に追加して記録
q q 記録を終了
@ N @{a-z} レジスタ{a-z}の内容を N 回実行
@@ N @@ 直前の@{a-z} を N 回実行
:@ :@{a-z} レジスタ{a-z}の内容を Ex コマンドとみなして、N 回実行
:@@ :@@ 直前の:@{a-z} を N 回実行
:g :[range]g[lobal]/{pattern}/[cmd]
[range]の中で、指定の{pattern}に合致する各行に対して
[cmd]コマンド(デフォルトでは ":p")を実行する
:g :[range]g[lobal]!/{pattern}/[cmd]
[range]の中で、指定の{pattern}に合致**しない**各行に
対して[cmd]コマンド(デフォルトでは ":p")を実行する

### quickfix

:cc :cc [nr] [nr]番のエラーを表示(省略すると再表示)
:cnext :cn 次のエラーを表示
:cprevious :cp １つ前のエラーを表示
:clist :cl 全エラーの一覧を表示
:cfile :cf 'errorfile' からエラーを読み込む
:cgetbuffer :cgetb :cbuffer と同様だが最初のエラーにジャンプしない
:cgetfile :cg :cfile と同様だが最初のエラーにジャンプしない
:cgetexpr :cgete :cexpr と同様だが最初のエラーにジャンプしない
:caddfile :caddf エラーファイルから現在の quickfix リストにエラー
を追加する
:caddexpr :cad 式から現在の quickfix リストにエラーを追加する
:cbuffer :cb バッファ内のテキストからエラーを読み込む
:cexpr :cex 式からエラーを読み込む
:cquit :cq ファイルを保存せずに、(コンパイラに)エラーコー
ドを戻して終了する
:make :make [args] make する。エラーを開き最初のコンパイルエラー
にジャンプ
:grep :gr[ep] [args] 'grepprg' を実行し、合致する最初の行にジャンプ

### Window

CTRL-W\__ CTRL-W _ 現在のウィンドウの高さを変更する
(既定値: 可能な限り高く)

CTRL-W*< CTRL-W < 現在のウィンドウの幅を減らす
CTRL-W*> CTRL-W > 現在のウィンドウの幅を増やす
CTRL-W_bar CTRL-W | 現在のウィンドウの幅を変更する
(既定値: 可能な限り広く)
CTRL-W_r CTRL-W r ウィンドウを下側にローテートする
CTRL-W_R CTRL-W R ウィンドウを上側にローテートする
CTRL-W_x CTRL-W x 現在のウィンドウを次のウィンドウと
入れ換え

CTRL-W_n CTRL-W n or :new 新たな空ウィンドウを作成
CTRL-W_q CTRL-W q or :q[uit] 編集を終了しウィンドウを閉じる
CTRL-W_c CTRL-W c or :clo[se] バッファを隠しウィンドウを閉じる
CTRL-W_o CTRL-W o or :on[ly] 画面を現在ウィンドウ１つだけにする

CTRL-W*] CTRL-W ] ウィンドウを分割し、カーソル下のタグ
にジャンプ
CTRL-W_f CTRL-W f ウィンドウを分割し、カーソル下のファ
イルにジャンプ
CTRL-W*^ CTRL-W ^ ウィンドウを分割し、別ファイルにジャ
ンプ

:sfind :sf[ind] {file} ウィンドウを分割し、{file}を 'path'
中で探し、それを編集

###

:up :[range]up[date][!] 変更されていれば、上書き保存
:wall :wa[ll][!] 変更のある全バッファを上書き保存

ZQ ZQ ":q!" と同じ

:xall :xa[ll][!] or :wqall[!] 変更のある全バッファを保存して終了

<C-z>

:pwd
:cd
:file (rename) (file info)
:files (all files)
gf (edit the file in which path the cursor is on )

CTRL-L CTRL-L 画面の再描画
CTRL-G CTRL-G 現在の(パス名＋)ファイル名とカーソル位置を
g_CTRL-G g CTRL-G カーソル桁数、行数、単語数、文字数を表示

U U 行全体への変更を取り消す
:undolist
:earlier/later [times]
:undo [change number] (jump to [change number] node)
g-/+ (undo/redo) -> move inside latest used branch
g;/, 変更リスト中の [count] 個前/後

###

:range , ２つの行の範囲
:range ; 同上。最初の指定行から次の指定範囲まで

:range {number} ファイル中の行番号
:range . 現在行
:range $ ファイルの最終行
:range % 1,$ と同じ(＝ファイル全体)
:range \* '<,'> と同じ(＝ビジュアルモードの選択範囲)
:range 't マーク t の行
:range /{pattern}[/] {pattern} に合致する行の次の行
:range ?{pattern}[?] {pattern} に合致する行の前の行

:range +[num] 直前の行指定(デフォルト:1)に[num]を加算した
もの
:range -[num] 直前の行指定(デフォルト:1)から[num]を減算し
たもの

### Term

-- :call jobstart('nvim -h', {'on_stdout':{j,d,e->append(line('.'),d)}})

### Make use of shellcmd output

:call setreg('f',system("ls"))
:put f

:exe 'norm i' . system("ls -l")
or use expression register (:help @=):
"=system('ls -la')
then hit P. Or shorter way by:
<CTRL-R>=system('ls -la')<CR>

:let @a=system("ls -l")
'<C-r>a' to paste

:r !command
:2r !date will insert the date value in line number 3.
:r !date +\%F<CR>

:<C-r>=system("ls -l")<cr>

:let a=system("date") | exec ".s/<datehere>/".a."/g" | .s/\%x00//g

If you want it in the current line you try just, but have in mind the old content of the line will be erased:
:.!date

If you want the exact cursor position you can:
:let a=system("date") | let b=substitute(a,"[\r\n]\*$","","g") | exec 'normal i'.b

Long story short: you need to substitute cause you want to get rid of ^@ (null characters) which you can also can replace with .s/\%x00//g. This is a shorter version with less pipes:
:exec 'normal i'.substitute(system("date"),"[\n]\*$","","")

And you can also set tags if you want to replace in various points at the same line:

Given this Line 1:
1 Date: <datehere> and also <datehere>

Execute:
:let a=system("date") | exec ".s/<datehere>/".a."/g" | .s/\%x00//g

After Replacement:
1 Date: jue ago 9 02:34:52 ART 2012 and also jue ago 9 02:34:52 ART 2012

:nmap \e i<c-r>=substitute(system('date'),'[\r\n]\*$','','')<cr><esc>

```vim
function InlineCommand()
    let l:cmd = input('Command: ')
    let l:output = system(l:cmd)
    let l:output = substitute(l:output, '[\r\n]\*$', '', '')
    execute 'normal i' . l:output
endfunction

nmap <silent> \e :call InlineCommand()<CR>
```

:command! -nargs=\* -complete=shellcmd R new | setlocal buftype=nofile bufhidden=hide noswapfile | r !<args>

The following example (for Unix) finds all files in or below the current directory that were modified in the last week (under 8 days); those files are searched for the text "vim", and all matching lines are listed in a new window:
:R find -mtime -8 | xargs grep vim

In buffer:
ls
ls

run :%!bash
buffer is replaced with the shellcmds outputs.

###

guu : lowercase line
gUU : uppercase line
~ : invert case (upper->lower; lower->upper) of current character
gf : open file name under cursor (SUPER)
ga : display hex, ascii value of character under cursor
g8 : display hex value of utf-8 character under cursor

'. : jump to last modification line (SUPER)
`. : jump to exact spot in last modification line
:history
:map \ : list mappings starts with \ (eg. nm, vm, tm vn(m)...)
"ayy@a : execute the Vim command in the current line
yy@" : same

<C-w>\_ : maximize window

:h ctrl<C-d> : list all keymaps of ctrl key

Sorting with external sort
:%!sort -u : contents of the current file is sorted and only unique lines are kept
:'v,'w!sort : sort from line marked v thru lines marked w
:g/^$/;,/^$/-1!sort : sort each block (note the crucial ;)

!1} sort : sorts paragraph; this is issued from normal mode!)

Entering !! in normal mode is translated to :.!
Appending a command sends the current line to the command replacing it with command's result
!!date : Replace current line with date
!!which command : Replace current line with the absolute path to command
!!tr -d AEIO : translate current line deleting As, Es, Is, and Os from the current line

You can also use ! on a visual selection. Select an area with one of the visualmode
commands, and then type !command to pipe the whole selection through command.
This is equivalent to :'<,'>!command.
For example, after selecting multiple lines with visualmode:
!sort : sort selected lines
!grep word : keep only lines containing 'word' in the selected range.

:e! : return to unmodified file
:args : display argument list
:n : next file in argument list
:prev : previous file in argument list
:rew : rewind to first file in argument list
:brew : rewind to first buffer in buffer list

qa : record keystrokes to register a
your commands
q : quit recording
@a : execute commands again
@@ : repeat

# editing a register/recording

"ap
<you can now see register contents, edit as required>
"add
@a
:%normal @a #execute the macro recorded in register a on all lines of the current file.
#or, with a visually selected set of lines:
:normal @a

[I : show lines matching word under cursor <cword>

/^fred.*joe.*bill : line beginning with fred, followed by joe then bill
/^[A-J] : line beginning A-J
/^[A-J][a-z]\+\s : line beginning A-J then one or more lowercase characters then space or tab
/fred\_.\{-}joe : fred then anything then joe (over multiple lines)
/fred_s\{-}joe : fred then any whitespace (including newlines) then joe
/fred\|joe : fred OR joe
/<!--\_p\{-}--> : search for multiple line comments \_ : multiline

:redir @\* : redirect commands to paste

:g/one\|two/ : list lines containing "one" or "two"
:g/^\s\*$/d : delete all blank lines
:g/green/d : delete all lines containing "green"
:v/green/d : delete all lines not containing "green"
:g/one/,/two/d : not line based
:v/./.,/./-1join : compress empty lines
Between lines with marks a and b (inclusive), append each line starting with "Error" to a file:

:'a,'b g/^Error/ .w >> errors.txt
Delete all lines containing "green" but not "red" or "pink". Command :g/^/ matches every line; the current line is copied into variable x; if any part of x matches (case sensitive) "green" and not "red" and not "pink", the line is deleted. Replace # with ? for case insensitive.

:g/^/let x=getline('.') | if x=~#'green' && x!~#'red' && x!~#'pink' | d | endif

:%s/fred/joe/igc : general substitute command
:%s/\r//g : delete DOS Carriage Returns (^M)
:'a,'bg/fred/s/dick/joe/gc : VERY USEFUL
:s/\(._\):\(._\)/\2 : \1/ : reverse fields separated by :

# non-greedy matching \{-}

:%s/^.\{-}pdf/new.pdf/ : to first pdf)
:s/fred/<c-r>a/g : substitute "fred" with contents of register "a"
:%s/^\(.\*\)\n\1/\1$/ : delete duplicate lines
:help /\{-}

# multiple commands

:%s/\f\+\.gif\>/\r&\r/g | v/\.gif$/d | %s/gif/jpg/
:%s/suck\|buck/loopy/gc : ORing
:s/**date**/\=strftime("%c")/ : insert datestring

<C-X><C-F> :insert name of a file in current directory

In buffer, with this content,
dr-------- 20906
drwx------ 20913
drwxr-x--- 20704
drwxr-xr-x 21104
lrwxrwxrwx 20606
-------r-- 21004
-rw-r----- 20716
-rwxrwx--- 21102

- run :%s/\v(.+r)(.+)\s(\d{5})/\1\3\2

- qqq : Start and immediately end recording for register q -- this essentially empties register q
  qq : Start recording actions into register q
  f2 : Find the "2" character to the right on this line (cursor will jump there)
  D : Delete and yank the 5-digit number into memory (rest of line)
  Fr : Find the "r" character to the left on this line (cursor will jump to the last "r")
  p : Paste the number that was yanked earlier after the "r" character
  Enter : Move the cursor to the first non-whitespace character of the next line
  @q : Execute the contents of register q (itself!), which is for now, empty, so nothing will happen. The trick here is that when we run it again with "@q" after you have ended the recording, it will call itself after processing each line! This recursive loop will process all the subsequent lines in that file, until it hits the end-of-file. This is the essence that makes complex repeats so flexible and powerful. (or, `:if cond | exe 'normal @q' | endif`)
  q : End the recording

Forget to add the recursion as a final step, or want to debug first before running the macro on every line in the file? An easy solution is, after you have the macro doing everything but the recursive call, just append it to the register. Assuming that you've recorded the macro into the 'q' register, just do this:

qQ
@q
q

- `:.,$normal @q.`

- mapping can be recursive too.
  :map z 2<C-a>jz
  :map z Iwc <Esc>lyawA><Esc>pa.log<CR>echo "HelloWorld"<Esc>jz

# keymap insert mode

CTRL-@ 前回の insert mode で入力した内容を再度入力し、insert mode を抜ける
CTRL-A 前回の insert mode で入力した内容を再度入力
CTRL-B 割り当てなし
CTRL-C insert mode を抜ける
CTRL-D インデントを 1 段階下げる(normal mode の<)
CTRL-E カーソルの下の文字を入力
CTRL-F 割り当てなし
CTRL-G CTRL-J insert mode に入った時のカーソル位置の下に移動
CTRL-G j insert mode に入った時のカーソル位置の下に移動
CTRL-G <Down> insert mode に入った時のカーソル位置の下に移動(未確認)
CTRL-G CTRL-K insert mode に入った時のカーソル位置の上に移動
CTRL-G k insert mode に入った時のカーソル位置の上に移動
CTRL-G <Up> insert mode に入った時のカーソル位置の上に移動(未確認)
CTRL-G u undo できない編集を開始(未確認)
CTRL-H back space
CTRL-I tab
CTRL-J 改行
CTRL-K {char} {char} マルチバイト文字を入力(例:CTRL-K ab =「ば」)
CTRL-L insert mode を抜ける(未確認)
CTRL-M 改行
CTRL-N カーソル位置の単語でコードヒンティングを出す
CTRL-O 一度だけノーマルモードのコマンドを入力できる
CTRL-P カーソル位置の単語でコードヒンティングを出す
CTRL-Q ターミナルに登録されていなければ CTRL-V と同じ
CTRL-R {0-9a-z"%#_:=} レジスタに登録されている文字を貼り付け
CTRL-R CTRL-R {0-9a-z"%#_:=} レジスタに登録されている文字を貼り付け
CTRL-R CTRL-O {0-9a-z"%#_:=} レジスタに登録されている文字を貼り付けてインデントを直さない(未確認)
CTRL-R CTRL-P {0-9a-z"%#_:=} レジスタに登録されている文字を貼り付けてインデントを直す(未確認)
CTRL-S 割り当てなし
CTRL-T インデントを 1 段階下げる(normal mode の>)
CTRL-U 行頭からカーソルの前までを削除
CTRL-V {a-z} 特殊文字を入力(例:CTRL-V a =「^A(アスキーコードが 1 の文字)」)
CTRL-V {0-9} {0-9} {0-9} 3 バイト文字を入力(例:CTRL-V 0 0 1 =「^A(アスキーコードが 1 の文字)」)
CTRL-W カーソルの単語の先頭からカーソルの前までを削除
CTRL-X CTRL-D 定義した識別子を補完
CTRL-X CTRL-E 1 行下にスクロール
CTRL-X CTRL-F ファイル名を補完
CTRL-X CTRL-I 単語を補完
CTRL-X CTRL-K 辞書から単語を補完
CTRL-X CTRL-L 行全体を補完
CTRL-X CTRL-N 次の補完候補を選択
CTRL-X CTRL-O omni 補完
CTRL-X CTRL-P 前の補完候補を選択
CTRL-X CTRL-S スペルチェック
CTRL-X CTRL-T シソーラスから補完
CTRL-X CTRL-Y 1 行上にスクロール
CTRL-X CTRL-U completefunc から補完
CTRL-X CTRL-V コマンドラインモードのように補完
CTRL-X CTRL-] タグを補完
CTRL-X s スペルチェック
CTRL-Y カーソルの上の単語を入力
CTRL-Z vim を停止
CTRL-[ <Esc>と同じ
CTRL-\ CTRL-N ノーマルモードに移動
CTRL-\ CTRL-G 明示的に insert mode に移動
CTRL-] 短縮入力(Abbreviations)を展開
CTRL-^ lmap を有効化・無効化
CTRL-\_ allowrevins が設定されている時に言語を切り替える
0 CTRL-D カーソルの行の全てのインデントを削除
^ CTRL-D カーソルの行の全てのインデントを削除

# Swap file Recovery

Check the date of swap file, the status of 'has/no change', and process id (PID: XXXXX)

- vim -r <file>
  `vim -r ""` pass empty string if the file which trying to recover has no name.
  Run on the cwd of previous session
- \*Save the file as a different name for safety
- :diffsp <file>

###

<CTRL-^> go back to alternate file (previous edited file)
\# (sharp): like % (current file)

### more tips

If you want to delete multiple adjacent duplicate lines
:%s/^\(._\)\n\(\1\n\)_/\1\r/

- Commands starts with 'g'
  g^ g$
  gn gN same as n,N and enter visual mode
  g'{mark} g`{mark}  same as ',` and won't update jumplist
  gf
  gp gP
  gJ
  gi start insert mode from "^ mark (the previous position where exit insert mode)
  gI
  g& 最後に実行した":s"を全ての行で実行する
  g< 前回のコマンド出力を表示する

<C-x><C-l> line completion
/<C-R><C-W> : Pull <cword> onto search/command line
<C-r>(register) put \*register in search/command line

:%!cat -n

### Global command

:g/one\|two/ : list lines containing "one" or "two"
:g/^\s\*$/d : delete all blank lines
:g/green/d : delete all lines containing "green"
:v/green/d : delete all lines not containing "green"
:g/one/,/two/d : not line based
:v/./.,/./-1join : compress empty lines

:'a,'b g/^Error/ .w >> errors.txt Between lines with marks a and b (inclusive), append each line starting with "Error" to a file:

### Operate command over multiple files

:argdo %s/foo/bar/
:bufdo %s/foo/bar/
:windo %s/foo/bar/
:tabdo %s/foo/bar/

### Appending to registers

yank 5 lines into "a" then add a further 5
"a5yy
10j
"A5yy
[I : show lines matching word under cursor <cword>
