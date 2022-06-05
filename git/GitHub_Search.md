https://docs.github.com/ja/search-github/searching-on-github/searching-issues-and-pull-requests
# 検索
256字以内 5条件以内 タイムアウトあり
"{空白を含む文字列}"
{文字列} {条件} (..繰り返し AND条件)
NOT {文字列}
### 条件
in:{title|,body|,comment}
author
review:{none|required|approved|changes_requested}
reviewed-by review-requested
asignee
mentions
commenter
involves
team organizationリポジトリ teamに対するメンション
state:{open|closed}
is:{merged|unmerged|pr|issue|open|closed}
linked:{issue|pr}
label
language
milestone

no:{label|milestone|asignee|project}
-{条件} 否定

{created|updated|merged|closed}:{YYYY-MM-DD|YYYY-MM-DDTHH:MM:SS{+09:00(UTC offset)}} {日付時刻|\*}..{日付時刻|\*}

comments:{日付範囲}

sort:{created|updated|commented|interactions}(-{asc|desc})

repo

head
base

## editor
vscode
sftp

## ssh
ssh config利用する
