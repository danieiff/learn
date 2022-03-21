## WebSocket
```ts
const ws = new WebSocket(url, protocols)
// new WebSocket("wss://www.example.com/socketserver", "protocolOne")
// new WebSocket("wss://www.example.com/socketserver", ["protocolOne", "protocolTwo"])
// new WebSocket('wss://localhost:8080')
ws.onopen/*addEventListener('open',*/ = (event) => {
    const message = {
        type: 'Message',
        id: '1234-1234',
        text: 'Testing the Hello World',
        date: Date.now()
    }
    ws.send(JSON.stringify(message))
}
ws.onmessage = (event) => {/* Receive messsage */}
ws.close()
```
```ts
const ws = new WebSocket('wss:{service}.vte.cx/w/{channel}/{group}')
// Access Point URL: /w/{channel}/{group}
const sendmsg = {
    summary:  "Content to be sent",
    link: [
       {
         ___rel: 'to',
         ___href: 'must include uid or account or * or #'
       }
   ]
};
```
```ts
const receivedmsg = {
    title: "error",
    summary: "Error Content",
};
```
