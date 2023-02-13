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


:! {shell command} -> :!node % (run node.js currentfile}
:r | {paste result to current file} --> combined :r! 


@: | run previous command after this, '@@' works like '.'


:Vexp :E | open netrw
