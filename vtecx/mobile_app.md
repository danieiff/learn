# Expo
Node.js(LTS) Watchman (for mac, linux) Git
npm install --global expo-cli

expoログイン expo register, expo login, expo whoami

expo init my-app, cd my-app

expo start, Expo Dev Tools, 実機からQRコード読み込んでアプリを動かせる, Emulator:[i]Phone [a]ndroid [w]eb browser

Expo CLIから
- development mode
hot reload
パフォーマンスが落ちる
- production mode
パフォーマンスが最適化

developer menu: 実機ならフリック エミュレーターなら(iOS)cmd+ctrl+z (android)ctrl+m

## デプロイ
キャッシュ削除
rm -rf node_modules && yarn cache clean && yarn && expo r -c


```json:app.json
{
  "expo": {
    "ios":{ "bundleIdentifier": "同一の値のビルド→Appstore提出で、自動アップデート" },
    "android":{"package":"同一の値のビルド→Google Play Store提出で、自動アップデート"}
  }
}
```
expo build:ios
初回のみApple Developer ProgramのCredentialsの入力を求められる。 ビルド時に変更可能
expo upload:ios | Transporterアプリ

expo build:android --type app-bundle --release-channel android
初回Google Play Console (Webインターフェース) | expo upload:android

## Google Firebase Console と プッシュ通知
### クライアント
- Andoroid
Google Firebase Consoleにapp.jsonのandroid.packageの値をパッケージ名としてアプリ登録
google-services.json (Android)
app.jsonにandroid.googleServicesFile: ./google-services.json(←パス設定), ルートへこれを置く
https://console.cloud.google.com/apis/credentialsで API restriction設定でFirebase Cloud Messaging API and Firebase Installations APIへの権限を持たせる
google-services.jsonのclient.api_key.current_keyの値Google API KEYを確認する

eas build --platform android (or expo build:android)でビルドし完了

- iOS
Google Firebase Consoleにapp.jsonのios.bundleIdentifierの値をbundle IDとしてアプリ登録
ダウンロードしたGoogleService-Info.plistをルートにおく app.jsonにこれのパス設定
(eas build) expo credentials:manager でプッシュ通知に関するCredentialsがビルド時にアップロードされる
(classic bulid) プッシュ通知に関するCredentialsがビルド時にアップロードされる
- Web
FirebaseにWebアプリ登録し、生成した設定をapp.jsonのweb.config.firebaseに設定する
"firebase": {
          "appId": "xxxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx",
          "apiKey": "AIzaXXXXXXXX-xxxxxxxxxxxxxxxxxxx",
          "projectId": "my-awesome-project-id",
          ...
          "measurementId": "G-XXXXXXXXXXXX"
### サーバー
At the top of the sidebar, click the gear icon to the right of Project Overview to go to your project settings in Google Firebase Console.
Click on the Cloud Messaging tab in the Settings pane.
Copy the token listed next to Server key.
Run expo push:android:upload --api-key <your-token-here>, replacing <your-token-here> with the string you just copied. We'll store your token securely on our servers, where it will only be accessed when you send a push notification.

https://docs.expo.dev/push-notifications/sending-notifications/
https://github.com/expo/expo-server-sdk-node
# FCM
形式
{"from":"Firebaseプロジェクト番号","priority":"normal","notification":{"title":"タイトル","body":"メッセージ","image":"画像URL"}}

```
<entry>
  <link rel="self" href="/_user/{UID}/push_notification" />
  <contributor>
    <uri>urn:vte.cx:fcm:{FCMの登録トークン}</uri>
    <name>{クライアントの種類(識別用項目)}</name>
  </contributor>
  <contributor>
    <uri>urn:vte.cx:expo:{Expoの登録トークン}</uri>
    <name>{クライアントの種類(識別用項目)}</name>
  </contributor>
  ...
</entry>
```
WebSocketメッセージ送信時にWebSocketに接続していない送信対象ユーザに、Pushメッセージを送る
```ts
vtecxapi.pushNotification(message: string, to: string[])
vtecxapi.pushNotification(title: string, message: string, imageUrl: string, to: string[])
// to: UID|アカウント|グループ
```
## クライアントの設定
### メッセージ通知受信設定
Firebase SDK
```html
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
 https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-analytics.js"></script>
```
Firebase configuration
```html
<script>
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "xxxx",
    authDomain: "xxxx",
    projectId: "xxxx",
    storageBucket: "xxxx",
    messagingSenderId: "xxxx",
    appId: "xxxx",
    measurementId: "xxxx"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>
```
通知の許可を取得
```js
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    // 通知を許可した場合
    console.log('Notification permission granted.');
  } else {
    // 通知を拒否した場合
    console.log('Unable to get permission to notify.');
  }
});
```
登録トークンの取得
```js
messaging.getToken({ vapidKey: 'VAPIDKEY' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
```
### メッセージ通知受信処理
firebase-messaging-sw.jsファイルが実行される。
```js
// Push通知を受け取ると呼ばれる
self.addEventListener('push', function (event) {
  // メッセージを表示する
  var data = {};
  if (event.data) {
    data = event.data.json();
  }

  var title = data.title;
  var message = data.body;
  event.waitUntil(
    self.registration.showNotification(title, {
      'body': message
    })
  );
});
```

### ADV
cd /Users/xxx/Library/Android/sdk/emulator
./emulator -list-avds
./emulator -avd Nexus_5X_API_30 -dns-server 8.8.8.8

/Users/hirohisa/Library/Android/sdk/emulator -list-avds

cd sdk/platform--tools
adb devices
expo start --localhost --android (expo ルートディレクトリで)

## ストアダウンロードリンク
https://play.google.com/intl/us-en/badges/
https://tools.applemediaservices.com

### デザイン
タッチ領域最小 44px
フォントサイズ 4の倍数px

## GA4
### イベント
自動収集イベント
測定機能の強化イベント コンテンツに対するインタラクション
推奨イベント 自身で実装するものの、事前に定義された名前とパラメータを持つイベント 既存のレポート機能を利用できる
カスタムイベント カスタムレポートを設定
- 全てのイベントのデフォルトプロパティ
language
page_location
page_referrer
page_title
screen_resolution

app_remove Androidのみ
Google Play Console によって報告される「1 日のアンインストール数（デバイス数）」や「1 日のアンインストール数（ユーザー数）」の指標とは異なります。app_remove イベントでは、インストール元に関係なく、アプリのパッケージが削除された回数がカウントされます。この回数はレポートで使用している期間によって変わります。「1 日のアンインストール数（デバイス数）」指標と「1 日のアンインストール数（ユーザー数）」指標では、Google Play からインストールされたアプリのパッケージについてのみ、削除された回数がカウントされ、日単位で報告されます。
通知イベント
- ユーザー アプリインスタンスIDで紐付け getAppInstanceId resetAnalyticsData
新規/既存 7日で区別
地域 市町村区まで
年齢
デバイス機種 OS
- 制限
アプリ インスタンスあたり 500 個
イベントあたりのイベント パラメータ	 25
ユーザー プロパティ	アプリ インスタンスあたり 25 個
ユーザー プロパティ名の長さ	24 文字 ユーザー プロパティ値の長さ

ユーザーリスト	100
コンバージョン	30
登録済みのユーザー プロパティ	25
登録済みのテキスト パラメータ	50
登録済みの数値パラメータ 50
登録済みのカスタム コンバージョン イベント	30


## Google Play Console
https://play.google.com/console/u/0/signup/playSignup

指標
インストール関連の統計情報
ユーザー
Google Play の個々のユーザーです。1 人のユーザーが複数のデバイスを所有している場合があります。
利用ユーザー
1 台以上のデバイスにこのアプリをインストールしたユーザーのうち、過去 30 日間にそのデバイスを使用したことがあるユーザーの数です。
ユーザー獲得数
このアプリをインストールしたユーザーのうち、インストールの時点ではいずれのデバイスにもアプリをインストールしていなかったユーザーの数です。アプリがプリインストールされているデバイスをアクティブ化したユーザーや、デバイスを再アクティブ化したユーザーも含まれます。
ユーザー減少数
自分のすべてのデバイスからこのアプリをアンインストールしたか、アプリをインストールしているデバイスを 30 日間以上使用していない（デバイスが非アクティブになった）ユーザーの数です。
新しいユーザー
このアプリを初めてインストールしたユーザーの数です。
リピーター
このアプリをインストールしたユーザーのうち、以前すべてのデバイスからアプリをアンインストールしたことのあるユーザーの数です。非アクティブ ユーザーが再びアクティブになった場合も含まれます。
総ユーザー数
新しいユーザーとリピーターです。
デバイス
あるユーザーに関連付けられている Android デバイスです。デバイスがリセットされた場合や、別のユーザーに移行された場合は、新しいデバイスとしてカウントされます。
アクティブなデバイス数
このアプリがインストールされているアクティブなデバイスの数です。アクティブなデバイスとは、過去 30 日間に 1 回以上オンになったデバイスです。
デバイス獲得数
ユーザーがこのアプリをインストールしたデバイスの数です。アプリがプリインストールされているデバイスも含まれます。
デバイス減少数
ユーザーがこのアプリをアンインストールしたデバイスの数です。過去 30 日間に使用されなかったデバイス（デバイスは非アクティブになります）も含まれます。
新しいデバイス
ユーザーがこのアプリを初めてインストールしたデバイスです。
リピーター デバイス
このアプリがインストールされたデバイスのうち、以前にもインストールされたことがあるデバイスです。非アクティブ デバイスが再びアクティブになった場合も含まれます。
すべてのデバイス
新しいデバイスとリピーター デバイスです。
デバイスのアップデート
このアプリが更新されたデバイスの数です。
更新後のデバイス減少数
このアプリが最近更新された後にアンインストールされたデバイスの数です。
インストール指標
このアプリがインストールされた回数です。以前にアプリがインストールされていたデバイスも含まれます。プリインストールやデバイスの再アクティブ化の場合は含まれません。
アンインストール指標
このアプリがアンインストールされた回数です。非アクティブなデバイスは含まれません。
1 日のアクティブ ユーザー（DAU）
特定の日にアプリを開いたユーザーの数です。
1 か月のアクティブ ユーザー（MAU）
直近 28 日間にアプリを開いたユーザーの数です。
1 か月間のリピーター数
アプリを開いた日から 28 日間のうちに再び開いたことが 1 日以上あったユーザーの数です。
ストアの掲載情報のユーザー獲得数
ストアの掲載情報にアクセスしてアプリをインストールしたユーザーのうち、それまでいずれのデバイスにもそのアプリをインストールしていなかったユーザーの数です。
ストアの掲載情報の訪問者数
ストアの掲載情報にアクセスしたユーザーのうち、それまでいずれのデバイスにもそのアプリをインストールしていなかったユーザーの数です。

## レポートをダウンロードする
Google Play Console を開きます。
[レポートをダウンロード] レポート をクリックし、[レビュー]、[統計情報]、[売上] のいずれかを選択します。
[アプリを選択] でアプリ名を入力し、選択します。
ダウンロードするレポートの年と月を選択します。

詳細レポート: 個々のイベントに関するデータ
  レビュー
  売上: 予想販売、収益、特典アイテム、韓国の Play 残高の入金元
集計レポート: アプリの統計情報の統合データ（平均、1 日の合計など）
  統計情報: インストール、クラッシュ、評価、定期購入
  ユーザー獲得: アプリをアンインストールしていないユーザー、購入者（インストールから 7日後）、定期購入者
- 集計レポートのコマンドとファイル形式
インストール数
gs://[developer_bucket_id]/stats/installs/installs_[package_name]_yyyyMM_[dimension].csv
クラッシュ
gs://[developer_bucket_id]/stats/crashes/crashes_[package_name]_yyyyMM_[dimension].csv
評価
gs://[developer_bucket_id]/stats/ratings/ratings_[package_name]_yyyyMM_[dimension].csv
- 詳細レポートのコマンドとファイル形式
レビュー
gs://[developer_bucket_id]/reviews/reviews_[package_name]_YYYYMM.csv

- Google Cloud Storage からレポートをダウンロード
レポートは毎日生成され、月ごとに CSV ファイルで集計
 Google Cloud Storage から BigQuery にレポートを読み込む場合は、CSV ファイルを UTF-16 から UTF-8 に変換

- クライアント ライブラリとサービス アカウントを使用してレポートをダウンロード
CLIを使う方法 gsutil
ステップ 1: サービス アカウントを作成する
Google Developers Console を開きます。
すでにプロジェクトがある場合は、プルダウンを使ってプロジェクトを選択します。プロジェクトが表示されていない場合や、新しいプロジェクトを作成する場合は、[プロジェクトを作成] をクリックします。
メニュー アイコン メニュー アイコン > [権限] > [サービス アカウント] > [サービス アカウントを作成] を選択します。
画面上の手順に沿って操作し、[作成] を選択します。
表示されたメールアドレスをコピーします。
例: accountName@project.iam.gserviceaccount.com

ステップ 2: Google Play Console にサービス アカウントを追加する
Google Play Console を開きます。
設定アイコン 設定 > [ユーザー アカウントと権限] > [新しいユーザーを招待] を選択します。
サービス アカウントに関連付けられたメールアドレスを貼り付けるか入力します。
必要なレポートの種類に基づいて、権限を選択します。
ヒント: ユーザーが実行できる操作や表示できる情報は、付与されるアクセスレベルと権限によって決まります。詳しくは、デベロッパー アカウント ユーザーの追加と権限の管理をご覧ください。
[ユーザーを追加] をクリックします。ご使用のアカウントにサービス アカウントが追加されます。

ステップ 3: API 呼び出しを使用してレポートを取得する
使用するコード言語の API クライアント ライブラリをインストールします。
OAuth2 のサーバー間認証を使用し、OAuth2 スコープ（https://www.googleapis.com/auth/devstorage.read_only）への権限を要求するための API 呼び出しを実行するコードを設定します。
認証された API 呼び出しを実行して、レポートを取得します。

## React Native, React Native for Web, Expo

### Layout
3 layers with flexbox
flex: 1
flexDirection: column|row
flexGrow: 0.8

use height, width only for image sizes

### Library
React Navigation
React Native Paper
