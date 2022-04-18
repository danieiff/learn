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
