const express = require('express');
const cors = require('cors');
const app = express();
const port = 5050;

app.use(cors());

const budget = {
  myBudget: [
    { title: 'Eat out', budget: 25 },
    { title: 'Rent', budget: 275 },
    { title: 'Grocery', budget: 110 },
  ],
};

// root route
app.get('/', (req, res) => {
  res.send('✅ Budget API is running');
});

// budget route
app.get('/budget', (req, res) => {
  res.json(budget);
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});