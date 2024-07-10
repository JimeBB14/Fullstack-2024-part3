const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://cruelSummer:${password}@cluster0.uidpnfl.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')

    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    if (name && number) {
      const person = new Person({
        name: name,
        number: number,
      })

      return person.save()
        .then(() => {
          console.log(`added ${name} number ${number} to phonebook`)
          return mongoose.connection.close()
        })
    } else {
      return Person.find({})
        .then(result => {
          console.log('phonebook:')
          result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
          return mongoose.connection.close()
        })
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })
