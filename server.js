const express = require('express')
const axios = require('axios')
const knex = require('knex')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

// Configure bodyParser for parsing JSON
app.use(bodyParser.json())

// Database configuration for SQLite3
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3', // Provide a path to your SQLite database file
  },
  useNullAsDefault: true, // To suppress SQLite's warning about inserting default values
})

// Create the "tickers" table if it doesn't exist
db.schema
  .hasTable('tickers')
  .then((exists) => {
    if (!exists) {
      return db.schema.createTable('tickers', (table) => {
        table.increments('id').primary()
        table.string('base_unit')
        table.float('buy')
        table.float('high')
        table.float('last')
        table.float('low')
        table.string('name')
        table.float('open')
        table.string('quote_unit')
        table.float('sell')
        table.string('type')
        table.float('volume')
      })
    }
  })
  .then(() => {
    console.log('Connected to SQLite database.')
  })
  .catch((error) => {
    console.error('Error connecting to SQLite database:', error)
  })

// Route to fetch and store data from the API
// ...

// Route to fetch and store data from the API
//when you run the front end. you need to run this api ONCE every time it loads!
app.get('/fetch-and-store', async (req, res) => {
  try {
    // Fetch data from the API
    const apiUrl = 'https://api.wazirx.com/api/v2/tickers' // Replace with the correct API URL
    const response = await axios.get(apiUrl)

    // Extract ticker values as an array
    const tickers = Object.values(response.data)

    // Map the API response to select only the desired columns
    const formattedTickers = tickers.map((ticker) => ({
      name: ticker.name,
      last: ticker.last,
      buy: ticker.buy,
      sell: ticker.sell,
      volume: ticker.volume,
      base_unit: ticker.base_unit,
    }))

    // Insert data into the database in smaller batches (e.g., batch size of 100)
    // code up something for top 10 cryptocurrency. USE CHATGPT to figure out top10
    const batchSize = 100
    for (let i = 0; i < formattedTickers.length; i += batchSize) {
      const batch = formattedTickers.slice(i, i + batchSize)
      await db('tickers').insert(batch)
    }

    res.json({ message: 'Data stored successfully' })
  } catch (error) {
    console.error('Error fetching and storing data:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})


// Route to retrieve data from the database
app.get('/get-tickers', async (req, res) => {
  try {
    const tickers = await db('tickers').select('*')
    res.json(tickers)
  } catch (error) {
    console.error('Error retrieving data from the database:', error)
    res.status(500).json({ error: 'An error occurred' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
