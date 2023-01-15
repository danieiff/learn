- tree
find . -not -path "./node_modules/*" -not -path "./.git/*" -not -path "*update*" -not -path "./dist/*" -not -path "*/img/*"  -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'

git archive --remote=git@github.com:UserName/repo-name.git master:subdir/foo | tar -x

curl http://www.site.org/image.jpg --create-dirs -o /path/to/save/images.jpg

ssh-keygen -t rsa (overwrite previous ssh key in ~/.ssh)
//# Copy ~/.ssh/id_rsa.pub and paste it to https://github.com/settings/ssh
ssh -T git@github.com //# For test
