import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 3001

const users = [
  { id: 1, username: 'somebody' },
  { id: 2, username: 'somebody_else' },
]

const customers = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Doe' },
  { id: 3, firstName: 'Ziv', lastName: 'Chen' },
  { id: 4, firstName: 'Isaac', lastName: 'Groisman' },
  { id: 5, firstName: 'Avner', lastName: 'Maman' },
  { id: 6, firstName: 'Megan', lastName: 'Dreyfuss' },
]

app.get('/users', (_request, response) => {
  response.json(users)
})

app.get('/api/customers/', (_request, response) => {
  response.json(customers)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Express API listening on http://localhost:${port}`)
})
