## 基本概念
エントリ XML JSON
リソース フォルダ エンドポイント フィード エントリ,(javascript上でのリクエスト)の関係
サービス ローカル リモートリポジトリ(GitHub)　の関係
URL(ブラウザ上、サーバーサイドスクリプト、サービス(apサーバー)上) KEY id link href rel
アカウント
トランザクション BDB ←→ データストア BigQuery
リクエスト、レスポンスのデータの形式の制限 スキーマかATOMの任意項目
リポジトリのsetup/_settings/properties.xml と サービスの/_settings/propertiesフォルダ(エントリ)の違い
## 環境構築
### プロジェクトリポジトリ
npm install create-vtecx-app
npx create-vtecx-app [your-project-name]
cd [your-project-name]
npm install
npm run login
### APIサーバー
1. First we sign up with vtecx
2. We login to vtecx
3. We create a service
4. Then we go to the management screen of the service
5. Then we login to our app using terminal
### ローカルプロキシサーバー
npm run serve ローカルサーバーを立てる(httpリクエストはサービスのサーバーにプロキシされる)

npm run serve:login
npm run serve:index
### サービス運用
npm run watch サービス上の該当フォルダにファイルをアップロードする
./deploy.sh シェルスクリプト deploy.shを実行して まとめて↑を行う
## クライアントサイド + サービス設定(/setup配下) サーバーサイドスクリプト(/server配下)
### サーバーサイドスクリプトの開発手順
1. `npm run login`　→ログインしているサービスにデプロイされる
2. `/server`配下に*`{スクリプト名}.ts/tsx`*~~/js/jsx~~をおく
3. `npm run watch -- --env entry=/server/{目的のファイル名}` →**ES5**へ変換 (ts/tsxをjsに変換している)
4. `GET|POST|PUT /s/{スクリプト名}`と呼び出す。 →最大実行時間5分
  `_async`パラメータを付けると非同期リクエスト →別スレッドが起動し、`202 Accepted`を返す。 バッチジョブサーバで、設定されたタイムアウト時間を最大実行時間として処理される。

src/server配下は npm run watch で/_html/server/{ファイル名} (jsファイルとしてアップロード)
HTTPメソッドで'/s/{ファイル名}'で呼び出す
レポジトリのsrc/components配下は npm run watchで サービスのフォルダ/_html/components/{ファイル名}にアップロードされる
レポジトリの src/components/{ファイル名}.html↓(最小限の構成)がsrc/components/.../{ファイル名}.tsxのエントリポイントになる
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, shrink-to-fit=no, initial-scale=1">
	<meta name="description" content="">
	<meta name="author" content="">
	<title>コントラーズ</title>
	<link rel="shortcut icon" href="img/favicon.png" type="image/png">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

</head>
<body>
	<div id="container"></div>
	<script crossorigin src="https://unpkg.com/react@17.0.1/umd/react.production.min.js" onerror="scriptError()"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17.0.1/umd/react-dom.production.min.js" onerror="scriptError()"></script>
  <script src="https://unpkg.com/react-router-dom@^5.2.0/umd/react-router-dom.min.js" onerror="scriptError()"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js" onerror="scriptError()"></script>
	<script src="components/index.js"></script>  // src="components/{ファイル名}.js" とする (サービスの/_html/components/{ファイル名}.jsを参照する)
</body>
</html>
```


### npm run upload/download


download時 管理画面から出力ボタンを押した後に、npm run download
