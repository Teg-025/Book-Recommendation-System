const express = require('express');
const ejs = require('ejs');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Load data from JSON files
const popular_df = JSON.parse(fs.readFileSync('data/popular1.json'));
const pt = JSON.parse(fs.readFileSync('data/pt1.json'));
const books = JSON.parse(fs.readFileSync('data/books1.json'));
const similarity_scores = JSON.parse(fs.readFileSync('data/similarity_scores1.json'));

app.get('/', (req, res) => {
    // Debugging: Log data being sent to the view
    console.log('Rendering home view with data:', {
        book_name: popular_df['Book-Title'],
        author: popular_df['Book-Author'],
        image: popular_df['Image-URL-S'],
        votes: popular_df['Number_Of_Ratings'],
        rating: popular_df['Average_Ratings']
    });
    res.render('home', {
        book_name: popular_df['Book-Title'],
        author: popular_df['Book-Author'],
        image: popular_df['Image-URL-S'],
        votes: popular_df['Number_Of_Ratings'],
        rating: popular_df['Average_Ratings']
    });
});

app.get('/recommend', (req, res) => {
    res.render('recommend');
});

app.post('/recommend_books', (req, res) => {
    const user_input = req.body.user_input;
    const index = pt.indexOf(user_input);
    const similar_items = similarity_scores[index]
        .map((score, idx) => [idx, score])
        .sort((a, b) => b[1] - a[1])
        .slice(1, 5);

    const data = similar_items.map(i => {
        const temp_df = books.filter(book => book['Book-Title'] === pt[i[0]]);
        const bookData = temp_df[0];
        return [
            bookData['Book-Title'],
            bookData['Book-Author'],
            bookData['Image-URL-S']
        ];
    });

    // Debugging: Log the data sent to the recommendation view
    console.log('Rendering recommend view with data:', { data });
    res.render('recommend', { data: data });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
