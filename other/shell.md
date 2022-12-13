- tree
find . -not -path "./node_modules/*" -not -path "./.git/*" -not -path "*update*" -not -path "./dist/*" -not -path "*/img/*"  -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'
