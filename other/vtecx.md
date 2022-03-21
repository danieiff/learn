# その他
## vw360px以下からViewPortのwidthを固定する
```js
!(function () {
  const viewport = document.querySelector('meta[name="viewport"]');
  function switchViewport() {
    const value =
      window.outerWidth > 360
        ? 'width=device-width,initial-scale=1'
        : 'width=360';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }
  addEventListener('resize', switchViewport, false);
  switchViewport();
})();
```
pwd
ls
cd
mkdir
touch
mv
cp
rm
cat
wc
head
tail
sort
uniq
grep
sed
awk
xargs
seq
> >>
apt
env
sudo
su
echo
which
source
chmod
ps
kill
history
diff
jobs
bg
fg
curl
git
gh
npm etc..

command lineでの正規表現

## git

1. git rebase -i HEAD~{数字}
2. pickを変更して閉じる
3. ファイルに変更を加える
4. staging, commit --amend
5. git rebase --continue

git diff
git prune
git branch -d -r {origin/...リモート追跡ブランチ}
git pull --rebase
git fetch origin 'refs/heads/{branch name}:refs/remotes/origin/{branch name}'
↑ feature/sugi の / をエスケープ必要？ → \/

## vim
### vimrc
```bash
augroup Mkdir
  autocmd!
  autocmd BufWritePre * call mkdir(expand("<afile>:p:h"), "p")
augroup END
```
## vscode
テンプレ　スニペット
### vscodeVim
- `cstt` タグ変更

テンプレファイル、複数作成スクリプト


expectによるコマンド自動化

テストファイル(ユーザー追加など)

ファイルの扱い (クライアント、サーバースクリプト)
