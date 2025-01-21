const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data.json');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;



app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  const exist = data.find((item) => item.book_id == book_id);
  if (exist) {
    return res.status(400).json({ error: 'The ID already exists' });
  }

  const newBook = { book_id, title, author, genre, year, copies };
  data.push(newBook);

  return res.status(201).json(newBook);
});


app.get('/books', (req, res) => {
  return res.json(data);
});


app.get('/books/:id', (req, res) => {
  const book = data.find((item)=>item.book_id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }
  return res.json(book);
});

app.put('/books/:id', (req, res) => {
  const book = data.find((item) => item.book_id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }
  const { title, author, genre, year, copies } = req.body;
  if(title) book.title = title;
  if(author) book.author = author;
  if(genre) book.genre = genre;
  if(year) book.year = year;
  if(copies) book.copies = copies;

  return res.status(200).json(book);
})

app.delete('/books/:id', (req, res) => {
  const isDeleted = data.findIndex((item)=>item.book_id === req.params.id);
  
  if (!isDeleted) {
    return res.status(404).json({ error: "Book not found." });
  }

  data.splice(isDeleted, 1);

  return res.status(200).json({ message: "Book deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
