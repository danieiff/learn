monorepo
```yml
name: auto_create_pull_request

on:
  push:
    branches:
      - release/**

jobs:
  pull_request:
    name: Create Pull Request to main
    runs-on: ubuntu-latest

    steps:
      - name: Exist Pull Request
        id: exist-pull-request
        uses: actions/github-script@v4

        with:
          script: |
            const branch = context.ref.replace('refs/heads/','')
            return await github.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              head: branch,
              base: 'master',
              state: 'open',
            })
      - name: Create Pull Request
        uses: actions/github-script@v4
        with:
          script: |
            const branch = context.ref.replace('refs/heads/','')
            github.pulls.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `${branch} 本番環境リリース`,
              head: branch,
              base: 'master'
            })
```

```yml:.github/labelar.yml
api
  - api/**/*
front
  - front/**/*
```
```yml:.github/workflows/add_label.yml
name: AddLabel
on: [pull_request]

jobs:
  label:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/labeler@v2
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

```
git sparse-checkout

git clone -b pushed_branch --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/account/monorepo.git .

git sparse-checkout add hoge1-be
git sparse-checkout add hoge2-be

git checkout
```

eslint `git diff HEAD~ HEAD --name-only --diff-filter=AMRT | tr '\n' ' '`

cache
```yml
 - name: Get yarn cache directory path
   id: yarn-cache-dir-path
   run: echo "::set-output name=dir::$(yarn cache dir)"

 - uses: actions/cache@v2
     id: yarn-cache
     with:
       path: |
         hoge1-fe/node_modules
         ${{ steps.yarn-cache-dir-path.outputs.dir }}

       key: ${{ runner.os }}-hoge1-fe-yarn-${{ hashFiles('**/yarn.lock') }}
```
