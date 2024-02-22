:Git! {args} Run in the background and stream the output to the preview window.
Or press CTRL-D during an interactive :Git invocation

:[range]Git blame [flags]
A resize to end of author column
C resize to end of commit column
D resize to end of date/time column
gq close blame, then |:Gedit| to return to work tree version
<CR> close blame, and jump to patch that added line (or directly to blob for boundary commit)
o jump to patch or blob in horizontal split
O jump to patch or blob in new tab
p jump to patch or blob in preview window - reblame at commit

                        The maps |fugitive_P| and |fugitive_~| are also
                        supported to reblame on a parent commit, but this is
                        inherently fragile, as the line being blamed will no
                        longer exist.  The preferred alternative is to use
                        <CR> to open up the commit, select the corresponding
                        `-` line that you care about, and press <CR> twice
                        more to reblame at that line.  Viewing the commit also
                        gives you additional context as to why the line
                        changed.

:Git[!] difftool [args] Invoke `git diff [args]` and load the changes into the quickfix list.
Jumps to the first change unless [!] is given.
:Git difftool -y [args] Invoke `git diff [args]`, open each changed file in a new tab, and invoke |:Gdiffsplit!| against the commit.

:Git mergetool [args] Like |:Git_difftool|, but target merge conflicts.

:{range}Gclog[!] [args] git-log -L to load previous revisions of the given range of the current file into the |quickfix| list.
:0Gclog target the entire file. :Gllog [args] use the location list

:Gedit [object] :Gsplit :Gvsplit :Gtabedit :Gpedit |:edit| a |fugitive-object|.

:{range}Gread [object] Empty the buffer and |:read| a |fugitive-object|.
When the argument is omitted, this is similar to
git-checkout on a work tree file or git-add on a stage
file, but without writing anything to disk.

:Gwrite When run in a work tree file, it is effectively git
add. Elsewhere, it is effectively git-checkout. A
great deal of effort is expended to behave sensibly
when the work tree or index version of the file is open in another buffer.
:Gwrite {path} You can give |:Gwrite| an explicit path of where in the work tree to write.
:0:foo.txt or :0:% to write to just that stage in the index.

:Gdiffsplit [object] The work tree version is always placed to the right or bottom
|do| and |dp| to stage and unstage changes.

:Gdiffsplit! Diff against any and all direct ancestors, retaining focus on the current window.
During a merge conflict, this is a three-way diff against the "ours" and "theirs" ancestors.
d2o d3o obtain the hunk "ours" "theirs"
:Gvdiffsplit [object]

:GMove {destination}  
:GRename {destination} Like |:GMove| but operates relative to the parent directory of the current file.
:GDelete Wrapper around git-rm that deletes the buffer afterward. When invoked in an index file, --cached is passed.

available in visual mode to operate on multiple files or partial hunks.
Staging/unstaging maps  
s u - U Stage or unstage the file or hunk under the cursor.
X Discard the change under the cursor. This uses `checkout` or `clean` under the hood.
During a merge conflict, use 2X to call `checkout --ours` or 3X to call `checkout --theirs` .

= > < Toggle an inline diff

gI Open .git/info/exclude in a split and add the file under the cursor. Use a count to open .gitignore.

Diff maps  
dd dv dh :Gdiffsplit
dq Close all but one diff buffer, and |:diffoff|! the last one.

Navigation maps  
<CR> Open the file or |fugitive-object| under the cursor.
In a blob, this and similar maps jump to the patch
from the diff where this was added, or where it was
removed if a count was given. If the line is still in
the work tree version, passing a count takes you to
it.

o gO O Open a new split, vsp, tab

~ Open the current file in the [count]th first ancestor.
P Open the current file in the [count]th parent.

C Open the commit containing the current file.

() Jump the file, hunk, or revision.

[c ]c Jump hunk, expanding inline diffs

[m ]m Jump to previous file, collapsing inline diffs

[[]] Jump [count] sections
[] ][

gu gU gs Jump to file [count] in the "Untracked" or "Unstaged", "Staged" section.
gp gP Jump to file [count] in the "Unpushed" section, "Unpulled" section.

gi Open .git/info/exclude in a split. Use a count to open .gitignore.

Commit maps  
cc Create a commit.
ca Amend the last commit and edit the message.
ce Amend the last commit without editing the message.
cw Reword the last commit.

cf Create a `fixup!` commit for the commit under the cursor.
cF cf and immediately rebase it.
cs Create a `squash!` commit for the commit under the cursor.
cS cs and immediately rebase it.
cA cs and edit the message.

:G commit
-C <commit> --reuse-message=<commit>
-c <commit> --reedit-message=<commit>

:G revert -m parent-number

Stash maps  
czz Push stash. Pass a [count] of 1 to add `--include-untracked` or 2 to add `--all`.
czw Push stash of the work-tree. Like `czz` with `--keep-index`.

czs Push stash of the stage. Does not accept a count.

czA Apply topmost stash, or stash@{count}.
cza Apply topmost stash, or stash@{count}, preserving the index.

czP Pop topmost stash, or stash@{count}.
czp Pop topmost stash, or stash@{count}, preserving the index.

branch <branchname> [<stash>]
Creates and checks out a new branch named <branchname> starting from the commit at which the <stash> was originally created, applies the changes recorded in <stash> to the new working tree and index.

-k --keep-index All changes already added to the index are left intact.
-S --staged Stash only the changes that are currently staged.
-- Separates pathspec from options for disambiguation purposes.

Rebase maps  
ri Perform an interactive rebase. Uses ancestor of commit under cursor as upstream if available.
rf Perform an autosquash rebase without editing the todo list. Uses ancestor of commit under cursor as upstream if available.

ru Perform an interactive rebase against @{upstream}.
rp Perform an interactive rebase against @{push}.
rr Continue the current rebase.
rs Skip the current commit and continue the current rebase.
ra Abort the current rebase.
re Edit the current rebase todo list.

rw Perform an interactive rebase with the commit under the cursor set to `reword`.
rm Perform an interactive rebase with the commit under the cursor set to `edit`.
rd Perform an interactive rebase with the commit under the cursor set to `drop`.

Miscellaneous maps  
gq Close the status buffer.
. Start a |:| command line with the file under the cursor prepopulated.
<C-R><C-G> On the command line, recall the path to the current |fugitive-object|
["x]y<C-G> Yank the path to the current |fugitive-object|.

master...other The merge base of master and other
Makefile The file named Makefile in the work tree
:Makefile The file named Makefile in the index (writable)
:1:% The current file's common ancestor during a conflict
:2:# The alternate file in the target branch during a conflict
:3:#5 The file from buffer #5 in the merged branch during a conflict
! The commit owning the current file
!:Makefile The file named Makefile in the commit owning the current file
!3^2 The second parent of the commit owning buffer #3
.git/config The repo config file

-   A temp file containing the last |:Git| invocation's output

git pull origin 'refs/heads/ft_d*:refs/remotes/origin/ft_d*'
pull specified prefix
If prefixed by ^, it will be interpreted as a negative refspec
-r --rebase[=false|true|merges|interactive]

### git branch

-m --move
-c --copy -C(force)

-i --ignore-case Sorting and filtering branches are case insensitive.

-r --remotes List or delete (if used with -d) the remote-tracking branches.
-a --all List both remote-tracking branches and local branches.
-l --list List branches. With optional <pattern>...

--contains [<commit>]
Only list branches which contain the specified commit (HEAD if not specified). Implies --list.
--no-contains [<commit>]
When combining multiple --contains and --no-contains filters, only references that contain at least one of the --contains commits and contain none of the --no-contains commits are shown.

--merged [<commit>]
Only list branches whose tips are reachable from the specified commit (HEAD if not specified). Implies --list.
--no-merged [<commit>]
When combining multiple --merged and --no-merged filters, only references that are reachable from at least one of the --merged commits and from none of the --no-merged commits are shown.
