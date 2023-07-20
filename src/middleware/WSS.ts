import WebSocket from "ws";

const ws = new WebSocket.Server({ port: 8361 })
ws.on('connection', (ws) => {
  console.log('server connection')
  ws.on('message', (msg) => {
    console.log('server receive msg：', msg.toString())
  })
  ws.send('Information from the server')
})
