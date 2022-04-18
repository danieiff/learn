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
 端末一覧を表示
./emulator -list-avds
 ↓Pixel_2_API_30の部分は端末一覧の中から的かつ変えてください
./emulator -avd Pixel_2_API_30 -dns-server 8.8.8.8

/Users/hirohisa/Library/Android/sdk/emulator -list-avds

cd sdk/platform--tools
adb devices
expo start --localhost --android (expo ルートディレクトリで)
