const database = require("./database");

function sendQuery(req, res, query, params = [], callback) {
    
    console.log("Executing query:", query, "with parameters:", params);

    database.query(query, params, (error, result) => {
        if (callback) {
        
            return callback(error, result);
        }

        if (error) {
            console.error('Database Query Error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }

      
        if (query.startsWith("INSERT INTO users")) {
            return res.status(201).json({ message: 'User registered successfully' });
        }

      
        res.status(200).json(result);
    });
}

module.exports = sendQuery;
