const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(contacts)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
  
    response.status(204).end()
  })

const generateId = () => {
    const maxId = contacts.length > 0
      ? Math.max(...contacts.map(c => c.id))
      : 0
    return maxId + 1
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.content.name || !body.content.number) {
      return response.status(400).json({ 
        error: 'The name or number is missing' 
      })
    }

    if (contacts.find((contact) => contact.name === body.content.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  
    const contact = {
      id: generateId(),
      name: body.content.name,
      number: body.content.number
    }
  
    contacts = contacts.concat(contact)
  
    response.json(contact)
  })
  

app.get("/info", (request, response) => {
    response.send(`<div>Phonebook has info for ${contacts.length} people</div><div>${new Date().toString()}</div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})