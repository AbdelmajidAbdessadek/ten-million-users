const express = require('express');
const cors = require('cors');
const fs = require('fs');
const readline = require('readline');

const app = express();
const PORT = 5000;
app.use(cors());

const USERS_FILE = 'users.txt'; // Assurez-vous que le fichier est bien à cet emplacement

app.get('/users', async (req, res) => {
    const letter = req.query.letter;
    const page = parseInt(req.query.page) || 1;
    const limit = 1000; // Nombre d'utilisateurs à charger par page
    const users = [];
    let totalUsers = 0;

    const stream = fs.createReadStream(USERS_FILE);
    const rl = readline.createInterface({ input: stream });

    for await (const line of rl) {
        if (!letter || line.startsWith(letter.toUpperCase())) {
            users.push(line);
        }
    }

    totalUsers = users.length;
    const paginatedUsers = users.slice((page - 1) * limit, page * limit);

    res.json({ users: paginatedUsers, total: totalUsers });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
