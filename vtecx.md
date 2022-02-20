## Milestones
1. フロントエンドのコーディングを身につける。(React, TypeScript, HTML, CSSを理解)
2. ワークフローを身につける (Gitと開発環境を理解)
3. vte.cxのAPIを利用する。

## vte.cx Docs Summary
### vte.cx makes it easy to work with server resources in BFF. -[*1.概要*](https://vte.cx/documentation.html#index01)
Common features: Account, DataBase, Mail, Excel, CSV, PDF, Barcode -[*2.主な機能*](https://vte.cx/documentation.html#index02)
[ここ](https://qiita.com/stakezaki/items/e526ca061d8f004db7f5)からAPIサーバーを立てる[*3.サービス*](https://vte.cx/documentation.html#index03)

目次
タイトル | ファイル | status
-|-|-
最初 | vtecx.md | 👈
BFF | server.md | ✅
CSV | server_csv.md | ✅
PDF | server_pdf.md | 残り:スタイリング表
BigQuery | server_bq.md | ✅
Barcode,QRcode| barcode_qrcode.md | 残り:スタイリング表見やすく
Mail | server_mail.md | 途中

### その他
#### vw360px以下からViewPortのwidthを固定する
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


### git

1. git rebase -i HEAD~{数字}
2. pickを変更して閉じる
3. ファイルに変更を加える
4. staging, commit --amend
5. git rebase --continue

git diff
git prune
git branch -d -r {origin/...リモート追跡ブランチ}
git pull --rebase
git fetch origin 'refs/heads/feature/sugi-*:refs/remotes/origin/feature/sugi-*'
↑ feature/sugi の / をエスケープ必要？ → \/

### vim
#### vimrc
```bash
augroup Mkdir
  autocmd!
  autocmd BufWritePre * call mkdir(expand("<afile>:p:h"), "p")
augroup END
```
### vscode
テンプレ　スニペット
### vscode extension
#### vscodeVim
- `cstt` タグ変更

テンプレファイル、複数作成スクリプト
