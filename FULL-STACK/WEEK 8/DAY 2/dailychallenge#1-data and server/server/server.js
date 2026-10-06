import express from 'express'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = process.env.PORT || 5000
const clientBuild = resolve(dirname(fileURLToPath(import.meta.url)), '../client/dist')

app.use(express.json())

app.get('/api/hello', (_request, response) => {
  response.json({ message: 'Hello From Express' })
})

app.post('/api/world', (request, response) => {
  console.log('Client request body:', request.body)

  const { message } = request.body ?? {}
  if (typeof message !== 'string' || !message.trim()) {
    return response.status(400).json({ message: 'Please send a non-empty message.' })
  }

  response.json({
    message: `I received your POST request. This is what you sent me: ${message}`,
  })
})

app.use(express.static(clientBuild))
app.get('/{*path}', (_request, response) => {
  response.sendFile(resolve(clientBuild, 'index.html'))
})

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})
