export const toAsyncFactory = (socketOrFactory) => {
  const continueWithError = (error) => (callback) => process.nextTick(() => callback(error))
  const continueWithValue = (value) => (callback) => process.nextTick(() => callback(null, value))
  const invalidArgsError = new Error("Must call createStream with a socket or factory function")
  if (!socketOrFactory) return continueWithError(invalidArgsError)
  if (typeof socketOrFactory === 'object') return continueWithValue(socketOrFactory)
  if (typeof socketOrFactory === 'function' && socketOrFactory.length === 0) return continueWithValue(socketOrFactory()) // for sync functions
  if (typeof socketOrFactory === 'function' && socketOrFactory.length > 0) return socketOrFactory
  return continueWithError(invalidArgsError)
}

export const concatChunks = (chunks) => {
  //chunks ::  [{ chunk: ..., encoding: ... }]
  const toBuffer = (chunk, encoding) => (encoding === 'utf8' ? Buffer.from(chunk, 'utf8') : chunk)
  const buffers = chunks.map(c => toBuffer(c.chunk, c.encoding))
  return Buffer.concat(buffers)
}

export const isBrowserSocket = (socket) => {
  return socket.send.length != 3; // send is sync in browser and async with length 3 on server using 'ws' module
}

export const initWebSocket = (stream, socket) => {
  // if (isBrowserSocket(socket)) {
  // }
  socket.binaryType = 'arraybuffer'
  socket.onopen = openHandler(stream)
  socket.onclose = closeHandler(stream)
  socket.onerror = errorHandler(stream)
  socket.onmessage = messageHandler(stream)

  stream.on('finish', streamFinishHandler(socket))
  stream.on('close', streamCloseHandler(socket))
  return socket
}

export const closeStreamWithError = (stream, err) => {
  stream.emit('error', err)
  stream.emit('close')
}

const openHandler = stream => evt => {
  stream.emit('connect')
}

const closeHandler = stream => evt => {
  // const { code, reason, wasClean } = evt
  stream.emit('close') // as a Readable, when socket is closed, indicate to consumers no more data is coming
}

const errorHandler = stream => err => {
  stream.emit('error', err)
}

const messageHandler = stream => {
  const toBuffer = (b) => (Buffer.isBuffer(b)) ? b : new Buffer(b)

  return evt => {
    stream.push(toBuffer(evt.data))
  }
}
const streamFinishHandler = socket => () => {
  if (socket.readyState === socket.OPEN) {
    socket.close()
  }
}
const streamCloseHandler = socket => () => {
  if (socket.readyState === socket.OPEN) {
    socket.close()
  }
}
