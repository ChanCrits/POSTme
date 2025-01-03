const sendQuery = require("./sendQuery");
const server = require("./server");
const multer = require("multer");
const path = require("path");

//Gamit kag  multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// User Registration
server.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("Registering user:", req.body);
  sendQuery(req, res, "INSERT INTO users (username, password) VALUES (?, ?)", [
    username,
    password,
  ]);
});

// User Login
server.post("/login", (req, res) => {
  const { username, password } = req.body;
  sendQuery(
    req,
    res,
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Login failed" });
      }
      if (result.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      res.json({
        message: "Login successful",
        redirect: true,
        user: result[0],
      });
    }
  );
});

//Mo  Create a bag o article
server.post("/articles", upload.single("image_url"), (req, res) => {
  console.log("Incoming article data:", req.body);
  const { title, content, user_id } = req.body;
  const image_url = req.file ? req.file.path : null;
  sendQuery(
    req,
    res,
    "INSERT INTO articles (title, content, image_url, user_id) VALUES (?, ?, ?, ?)",
    [title, content, image_url, user_id.trim()]
  );
});

// E View ang tanan articles
server.get("/articles", (req, res) => {
  sendQuery(
    req,
    res,
    "SELECT articles.*, users.username FROM articles JOIN users ON articles.user_id = users.id"
  );
});

//E View ang tanan articles
// server.get('/articles', (req, res) => {
//     const query = `
//         SELECT articles.*, users.username
//         FROM articles
//         JOIN users ON articles.user_id = users.id
//         WHERE articles.user_id IN (15, 16, 17, 18)
//         ORDER BY FIELD(articles.user_id, 15, 16, 17, 18), articles.created_at ASC
//     `;
//     sendQuery(req, res, query);
// });

//E Update ang article
server.put("/articles/:article_id", upload.single("image_url"), (req, res) => {
  const { title, content, user_id } = req.body;
  const image_url = req.file ? req.file.path : null;
  const query = image_url
    ? "UPDATE articles SET title = ?, content = ?, image_url = ? WHERE article_id = ? AND user_id = ?"
    : "UPDATE articles SET title = ?, content = ? WHERE article_id = ? AND user_id = ?";
  const values = image_url
    ? [title, content, image_url, req.params.article_id, user_id]
    : [title, content, req.params.article_id, user_id];

  sendQuery(req, res, query, values);
});

//E Delete anh article
server.delete("/articles/:article_id", (req, res) => {
  const { user_id } = req.body;
  sendQuery(
    req,
    res,
    "DELETE FROM articles WHERE article_id = ? AND user_id = ?",
    [req.params.article_id, user_id]
  );
});

//E Get users list katong mo show sa active users
server.get("/users", (req, res) => {
  sendQuery(req, res, "SELECT username FROM users", (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send("Server error");
    }
    res.json(results);
  });
});
