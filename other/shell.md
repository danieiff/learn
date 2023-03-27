- tree
find . -not -path "./node_modules/*" -not -path "./.git/*" -not -path "*update*" -not -path "./dist/*" -not -path "*/img/*"  -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'

git archive --remote=git@github.com:UserName/repo-name.git master:subdir/foo | tar -x

curl http://www.site.org/image.jpg --create-dirs -o /path/to/save/images.jpg

ssh-keygen -t rsa (overwrite previous ssh key in ~/.ssh)
//# Copy ~/.ssh/id_rsa.pub and paste it to https://github.com/settings/ssh
ssh -T git@github.com //# For test

- ss -net
- base64
- tar
- ln -s {destination} {original (absolute path)}
- find
- grep
- script {file} -> exit
- curl
- awk
- xargs
- ls
- cd
- cp
- mv 
- rm
- cat
- echo (printf)
- touch
- mkdir
- man
- which
- cron `'crontab -e` `sudo service cron start` `sudo service cron stop`
- ~- (previous directory)
- >
- >>
- 2> (redirect error) `{BADCOMMAND} 2> error.txt`
- | (pipe)
- ;
- * (wildcard >= 0)
- ? (wildcard 1 character)

- fzf

## vim
g<  | last status message

inoremap <C-u>  <C-g>u<C-u>
inoremap <C-w>  <C-g>u<C-w> |

" Save fold settings.
autocmd BufWritePost * if expand('%') != '' && &buftype !~ 'nofile' | mkview | endif
autocmd BufRead * if expand('%') != '' && &buftype !~ 'nofile' | silent loadview | endif
" Don't save options.
set viewoptions-=options | :mkview, :loadview -> save, read buff setting

| format indent, etc... when paste

inoremap <C-u>  <C-g>u<C-u>
inoremap <C-w>  <C-g>u<C-w> | enable redo undo while insert mode
<C-u> , <C-w> | undo, delete word in insert mode
:undolist -> number changes time 2 2 19 seconds ago 3 2 16 seconds ago
-> undo {number}
: earlier (later) {time}(s/m/h)
g-(+) | undo-branches
<C-^> | open alternate file (previous editing file)

remap hard type keys like ^
indent key map

q: | cmd history
q/ | search with word in register 

:&& :& | repeat cmd

:help {key} | see help for function mapped to the key
:helptags | link help text from plugin

% | buff name in register

| map key to open memo file

:colorscheme CTRL-D | List colorschemes

g\* | In normal mode, search cursor word ( match with 'foo' is 'foobar' )

gf | goto file on cursor word, (<C-w>f | in new window)

m {any capital alphabet} |  marked file openable from anywhere

vimdiff (vim -d) {file1} {file2} | :diffsplit {filename}
[c ]c | jump between diffs
do dp | "diff obtain" "diff put" | ":diffget" ":diffput" exp) :'<,'>diffput 
" バッファ名に "BASE" を含むバッファを対象にする
:diffget BASE
:diffupdate
バッファを更新していると、差分のハイライトが徐々におかしくなることもあります。その場合は、:diffupdate コマンドを実行すれば差分情報を更新


:! {shell command} -> :!node % (run node.js currentfile}
:r | {paste result to current file} --> combined :r! 


@: | run previous command after this, '@@' works like '.'


:Vexp :E | open netrw

### Ex mode

:vs (sp) +{line number} 
+ | last line 
+/{pattern} | first match
(can be used in tabnew)


<C-w> t(b) | top(bottom) window
<C-w> +|-|<|>|= | resize window
q | close o (only)

:5y | :4,10y | :%y (yank whole file) | :y (yank current line)
:pu	現在行の後にプット（ノーマルモードのpと同様）
:pu!	現在行にプット（ノーマルモードのPと同様）
:3pu	3行目の後にプット
:3pu!	3行目にプット
:10co.	10行目を現在行の後にコピー（.は現在行を意味する）
:1,5co-	1~4行目を現在行にコピー（-は-1行を意味する、現在行より1行前の場合は-2）
:co10	現在行を10行目の後にコピー
('t' can be used instead 'co')
('d' can be used like 'y' for deletion)


ノーマルモード	なし	:h iw
挿入モード	i_	:h i_ctrl-w
ビジュアルモード	v_	:h v_c
コマンドラインモード	c_	:h c_ctrl-w
Terminal-Jobモード	t_	:h t_ctrl-w_n
Exコマンド	:	:h :w

:rはコマンドの標準出力結果もしくはファイルの中身を現在開いているファイルに追加 (:r! curl -s https://...)
:%!jq

### Netrw
:e .	カレントバッファ
:e DIR	カレントバッファ
:Ex(plore) DIR	カレントバッファ
:Tex(plore) DIR	新タブ
:Hex(plore) DIR	水平分割した下ウインドウ
:Sex(plore) DIR	水平分割した上ウインドウ
:Vex(plore) DIR	垂直分割した左
:Lex(plore) DIR	カレントタブの左側

Enter	ディレクトリの場合は移動、ファイルの場合はカレントバッファに開く
- 重要	一つ上のディレクトリに移動
※僕は設定で、「h」でも移動するようにしています
u	undo、１つ前のディレクトリに戻る
U	redo、uで戻る前のディレクトリに戻る
/文字 重要	検索
c 重要	Netrwのカレントディレクトリを、現在開いているディレクトリに変更
Newrwを終了したら、Newrwを起動したディレクトリになる。
ファイルを開く
Enter	今netrw.vimで開いているバッファの上にファイルを開く
（netrw.vimの画面は消え去る）
o	水平分割で、ファイルを開く
分割後の移動は、 <c-w>h, <c-w>j, <c-w>k, <c-w>l
v	垂直分割で、ファイルを開く
分割後の移動は、 <c-w>h, <c-w>j, <c-w>k, <c-w>l
t 重要	タブで、垂直分割で、ファイルを開く
この方法で編集しないと、ファイル編集終了後にNetrwも終了してしまいます。
※僕は設定で、Enterでもタブで表示するように設定しています。
・gt 次のタブへ
・gT 前のタブへ
・{i}gt i番目のタブへ
:e ファイル名 重要	ファイルを作成して編集
事前にcコマンドでカレントディレクトリを変更しておくこと
x	標準アプリで起動
ファイル操作
d	ディレクトリを作成する
Making A New Directory
D	ディレクトリ・ファイルを削除する
（ディレクトリに関しては、中が空の場合のみ）
Deleting Files Or Directories
ファイル操作（マーク）
1 「mt」でターゲットディレクトリを指定

2 「mf」でファイルをマーク

3 「mc」でコピー
  「mm」で移動
  「mg」で、vimgrep
  「md」で、vimdiff
マークする
mf	ファイルをマークする
Marking Files
※ディレクトリはマークできないので、操作できないです。
mr	ワイルドカードを指定してファイルをマークする
Marking Files By Regular Expression
mu	すべてのマークを解除
Marked Files: Unmarking
マーク後の処理
mt	コピー・移動先のディレクトリをマークする
Current browsing directory becomes markfile target
mc	mfしたファイルをmtしたディレクトリにコピーする
Copy marked files to target
mm	mfしたファイルをmtしたディレクトリに移動する
Move marked files to target
mx	マークファイルにシェル実行。コマンド中の“%“がファイル名
Apply shell command to marked files
md	マークファイルにvimdiffを実行。ファイルは3つまで
mg	マークしたファイルにvimgrepで検索
Apply vimdiff to marked files
D	マークしたファイル、ディレクトリを削除
Delete marked files/directories
その他
:! コマンド 重要	コマンドを実行
:!rm -rf xxxx
:!mv xxx yyy
:!vi xxxx
:sh 重要	シェルを起動。exitでnetrwに戻ってくる
表示
I	ヘッダの表示トグル
i	ファイルツリーの表示形式を変更
p	ファイルをプレビューする
a	すべて表示 → 隠しファイル非表示 → 隠しファイルのみ表示
gh	ドットで始まるファイルの表示・非表示を切り替える
s	ソートの種類を変更（名前 → 時間 → ファイルサイズ）
r	ソートの順番を逆にする
ブックマーク
注意：TreeViewで表示していると移動できない。

mb	ディレクトリ/フォルダをブックマークに追加する
Bookmarking A Directory
qb	ブックマークと移動履歴の一覧を確認する
Listing Bookmarks And History
数字qb	数字で指定したブックマークに移動


### tips
:e **/*.php<C-d> -> :e **/*Repository.php<C-d> -> <Tab>と<S-Tab>
*を使っていない部分は<C-l>で候補結果を見て最長一致するところまで補完してくれます。
また、一度<Tab>を押すと<C-n>と<C-p> でも上下移動できます。<C-w>を押すと１単語消し

set path+=src/**,lib/** -> :fin[d] (:fin *.php<C-d>)
:e のsp[lit] や vs[plit]、tabe[dit] 同様に :sfin[nd] や :vert[ical] sfin[ind] 、tabf[ind]
:e %:h<C-d>
%が今のファイルで:hがそのディレクトリという意味です。もう一つ上の階層に行きたい場合は、もう一つ:hをつけて:e %:h:h<C-d>

:b <C-d> <C-d>と<C-l>で表示、補完しながら
~/.config.nvim/init.vim を開き直したい場合は、:b ini<Tab><CR> で開けます。
１個前のファイルとかなら、:b[p]revious
新しいwindowsで開く場合は、:sb、:vert sb

Vimを新しく開いあとはv:oldfiles
echo v:oldfiles で配列が返ってきますが、そこからファイルを選びたい場合は、
:browseを組み合わせて使う

まずは:b <C-d>、次に:bro old、 その次に:e <C-d>、:fin <C-d>の順番で考えましょう。

:Explore か、:E でファイラを開けます。左側に開きたい場合は、:Vexploreしましょう。

<CR> でディレクトリを開閉かファイルを開けます。
t で新しいタブで開き、o や v で上下左右に分割して開きます
% でファイル作れてDで消せます。dでフォルダ作れるけど消すのは空じゃないとできません。
%<Tab> で今のディレクトリを補完できますので、:rm! -rf %<Tab>/xxx で補完して消すのがおすすめ
ファイル開いてから、そのファイルで :E すれば、そのファイルのフォルダで開けます。
逆にルートから開き直したい場合は、:E .
他のEから始まるコマンドと競合する場合は command! -nargs=? E Explore <args>

:vim hello src/** | cw とすると、quickfix window が開いて、そのままクリックするだけで開けます。
:cc で現在のエラー、:cn で次のエラー、:cnfで次のファイルのエラー、:cp で前のエラーに飛びます。
@: で前に実行したコマンドが打てて、一度@:を押すとマクロ同様に@@で繰り返せます

<C-]>が使えます。ウィンドウ分割する場合は<C-w>]です。
<C-w>}でプレビューウィンドウに表示できます。

コード補完は、<C-x><C-o>で使えます。変数名やメソッド名などが出てくれます。
augroup my-lsp-diagnostic
  au!
  " diagnostic (エラー) を location list に出す
  au DiagnosticChanged *.go,*.ts,*.tsx lua vim.diagnostic.setloclist({open = false})
augroup end

" カーソル下の変数名変更
nnoremap <leader>rn :<C-u>lua vim.lsp.buf.rename('')<Left><Left>

" ファイルのフォーマット
nnoremap <leader>f <Cmd>lua vim.lsp.buf.format()<CR>

" プロジェクト内の全てのエラーを `quickfix window`に出す
nnoremap <leader>q <Cmd>lua vim.diagnostic.setqflist()<CR>

### fold
 	開く	閉じる	トグルする	全体を開く	全体を閉じる
1 段階	zo	zc	za	zr	zm
全て	zO	zC	zA	zR	zM
zv
カーソル行が表示されるレベルまで折り畳みを開きます。
zX
折り畳みを更新します。 'foldlevel' が再適用され、全ての折り畳みが 'foldlevel' まで折り畳まれた状態になります。 また、'foldexpr' を使っている場合は各行の折り畳みレベルが再計算されます。
zx
zX を実行してから zv を行います。
:[range]foldopen[!]
:[range]foldclose[!]
範囲にある折り畳みを開く、もしくは閉じます。! が与えられた場合は全ての深さの折り畳みが開閉されます。範囲が省略された場合は現在行が対象になります。
Hack #178: テキストを折り畳む – 操作編
Posted at 2010/10/23

 

折り畳みに対する操作と言えば基本は畳む/開くですが、それら以外にも様々な操作があります。

折り畳みを開く/閉じる
折り畳みの基本である開閉の操作には、折り畳みレベルを 1 段階変更するものと、全ての深さの折り畳みを変更する、つまり完全に開いたり折り畳んだりするものがあります。

折り畳みの開閉に関するキーマッピングは以下のようなものがあります。

 	開く	閉じる	トグルする	全体を開く	全体を閉じる
1 段階	zo	zc	za	zr	zm
全て	zO	zC	zA	zR	zM
zo/zc/za は現在のカーソル位置に対して働くのに対し、zr/zm はウィンドウ全体が対象になります。zr/zm は実際には 'foldlevel' を変更することで折り畳みを変更しています。

また、折り畳まれている行ではカーソルは常に行頭に表示されます。ただし、実際にはカーソル位置は記憶されています。ここで、カーソルを左右に動かすことで折り畳みは展開されます。

これら以外にも以下のような操作があります。

zv
カーソル行が表示されるレベルまで折り畳みを開きます。
zX
折り畳みを更新します。 'foldlevel' が再適用され、全ての折り畳みが 'foldlevel' まで折り畳まれた状態になります。 また、'foldexpr' を使っている場合は各行の折り畳みレベルが再計算されます。
zx
zX を実行してから zv を行います。
:[range]foldopen[!]
:[range]foldclose[!]
範囲にある折り畳みを開く、もしくは閉じます。! が与えられた場合は全ての深さの折り畳みが開閉されます。範囲が省略された場合は現在行が対象になります。
折り畳みを作成/削除する
'foldmethod' のが “manual” か “marker” の場合、以下の操作で折り畳みの作成と削除ができます。

zf{motion}
{Visual}zf
[count]zF
:{range}fold
対象の範囲に新しく折り畳みを作成します。
zd
カーソル位置にある折り畳みを 1 つ削除します。
zD
カーソル位置の折り畳みを再帰的に全て削除します。
zE
ウィンドウ内の折り畳みを全て削除します。

zn ： 折り畳みを無効にします。

zN ： 折り畳みを有効にします。

zi
折り畳みの有効化/無効化を切り替えます

[z
現在いる折り畳みの先頭へ移動します。
]z
現在いる折り畳みの末尾へ移動します。
zj
次にある折り畳みへ移動します。
zk
前にある折り畳みへ移動します。

:[range]folddoopen {cmd}
:[range]folddoclose {cmd}
バッファ全体、もしくは指定した範囲にある、折り畳まれていない、もしくは折り畳まれている行に対して {cmd} を実行します。これは :global に似ていて、実行する行を正規表現ではなく折り畳みの状態で指定しているのとほぼ同じです。 折り畳まれていない行には、折り畳み自体が存在しない行も含みます。
