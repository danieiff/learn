```ts
/* eslint-disable */
// @ts-nocheck

const ws = new WebSocket('wss:{service}.vte.cx/w/{channel}/{group}')
// new WebSocket(url, protocols)
ws.addEventListener('open', (event) => {
  const sendmsg = {
    summary: 'Content to be sent',
    link: [
      {
        ___rel: 'to',
        ___href: 'uid or account or *(everyone (except you) in a group) or #',
      } /* , ... */,
    ],
  }
  ws.send(JSON.stringify(sendmsg))
})

ws.addEventListener('message', (event) => {
  /* Receive messsage */
  // {
  //   title: 'error ...',
  //   summary: 'Error Content',
  // }
})

ws.close()

// 10分間隔でポーリングを行う必要がある
const data_polling = [{ link: [{ ___rel: 'to', ___href: '#' }] }]

// 例
 React.useEffect(() => {
    if (socket) {
      socket.addEventListener(WEBSOCKET_EVENTS.OPEN, () => console.debug('WebSocket is open'))
      socket.addEventListener(WEBSOCKET_EVENTS.CLOSE, () => console.debug('WebSocket is closed'))
      socket.addEventListener(WEBSOCKET_EVENTS.ERROR, (_error: any) =>
        console.debug('Socker Events Error', _error)
      )
      socket.addEventListener(WEBSOCKET_EVENTS.MESSAGE, (event: any) => {
        const data = JSON.parse(get(event, 'data', {}))
        const currentMessageId = get(data, 'message.message_id', '')
        const hasMessage = currentMessageId ? true : false
        if (hasMessage) {
          const info_type = get(data, 'info.info_type', '')
          if (info_type) {
            updateMessage({ identifier: id, message: data, pickBy: 'message.message_id' })
          } else {
            updateMessageSeenStatus({
              messages: [data],
              afterPrepareMessage: ({ updateMessageList }) => {
                const newData = head(updateMessageList)
                if (hasObjectInfo(newData)) addMessage({ identifier: id, message: newData })
              }
            })
          }
        }
      })
    }
    return () => {
      if (socket) socket.close()
    }
  }, [socket])
  ```

# プッシュ通知
## FCM
形式
{"from":"Firebaseプロジェクト番号","priority":"normal","notification":{"title":"タイトル","body":"メッセージ","image":"画像URL"}}

```xml
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