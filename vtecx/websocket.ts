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
