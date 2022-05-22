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
##
```js
const segmenter = new Intl.Segmenter();

function reverseStr(str) {
  let ret = "";
  for (const segment of segmenter.segment(str)) {
    ret = segment.segment + ret;
  }
  return ret;
}
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

### Cookie
httpOnly
SameSite=strict
secure=true
ユーザーがサイトにリクエストを送信するたびに、必ずセッションID（セッションIDはユーザーから送信されたcookieから取り出します）を使ってアカウントの詳細情報をデータベースまたはキャッシュから取り出してください（どちらを使うかはサイトの規模によります）。
local storage はクライアントのみで完結 Javascriptからアクセス可 string型のみ 同期処理、サービスワーカーから操作できないのでパフォーマンス悪い CDN(やリモートリポジトリ)の汚染されたライブラリからいつでもXSSの可能性がある
cookie (httpOnly)はサーバーからのみ読める
indexedDB 型情報保存可https://developers.google.com/web/ilt/pwa/working-with-indexeddb

webアプリをオフラインで動かす IndexedDBとCache API https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api

特異なUnicode https://github.com/Codepoints/awesome-codepoints
