const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const proverbs = require('./proverbs');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Homepage (all proverbs)
app.get('/', (req, res) => {
    res.render('index', { proverbs });
});

// Single proverb
app.get('/proverbs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const proverb = proverbs.find(p => p.id === id);
    if (!proverb) return res.send('Proverb not found');
    res.render('show', { proverb });
});

// New proverb form
app.get('/new', (req, res) => {
    res.render('new');
});

// Create new proverb
app.post('/proverbs', (req, res) => {
    const { textDari, textPashto, translationEnglish, meaning, category } = req.body;
    const newProverb = {
        id: proverbs.length + 1,
        textDari,
        textPashto,
        translationEnglish,
        meaning,
        category
    };
    proverbs.push(newProverb);
    res.redirect('/');
});

// Edit form (GET)
app.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const proverb = proverbs.find(p => p.id === id);
    res.render('edit', { proverb });
});

// Update proverb (POST)
app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const proverb = proverbs.find(p => p.id === id);
    proverb.textDari = req.body.textDari;
    proverb.textPashto = req.body.textPashto;
    proverb.translationEnglish = req.body.translationEnglish;
    proverb.meaning = req.body.meaning;
    proverb.category = req.body.category;
    res.redirect('/');
});

// Delete proverb
app.post('/proverbs/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    const index = proverbs.findIndex(p => p.id === id);
    if (index !== -1) proverbs.splice(index, 1);
    res.redirect('/');
});

// Filter by category
app.get('/category/:category', (req, res) => {
    const category = req.params.category;
    const filtered = proverbs.filter(p => p.category === category);
    res.render('index', { proverbs: filtered });
});

// Random proverb
app.get('/random', (req, res) => {
    const random = proverbs[Math.floor(Math.random() * proverbs.length)];
    res.render('show', { proverb: random });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});