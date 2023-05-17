require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let contacts = []

app.get("/api/persons", (request, response) => {
    Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
    Contact.findById(request.params.id).then(
      contact => {
        if (contact) {
          response.json(contact)
          contacts = contacts.filter(contact => contact.id !== id)
        }
        else {
          response.status(404).end()
        }
      }
    ).catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id).then(
      result => {
          response.status(204).end()
      }
    ).catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
    .catch(error => next(error))
  })

const generateId = () => {
    const maxId = contacts.length > 0
      ? Math.max(...contacts.map(c => c.id))
      : 0
    return maxId + 1
  }

app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ 
        error: 'The name or number is missing' 
      })
    }

    if (contacts.find((contact) => contact.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  
    const contact = new Contact({
      id: generateId(),
      name: body.name,
      number: body.number
    })
  
    contact.save().then(result => {
      response.json(result)
    })
    .catch(error => next(error))
  })
  

app.get("/info", (request, response) => {
    response.send(`<div>Phonebook has info for ${contacts.length} people</div><div>${new Date().toString()}</div>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})