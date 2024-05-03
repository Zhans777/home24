import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Вызываем класс Pool из pg для создания объекта настроек БД
const db = new Pool({
  user: "postgres",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "todolist",
})

// получение всех items
app.get("/", (req, res) => {
  db.query("SELECT * FROM items", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Что-то пошло не так");
    } else {
      const items = result.rows;
      res.render("index.ejs", {
        listTitle: "Сегодня",
        listItems: items,
      });
    }
  });
});


// добавление item и сохранение в БД
app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query(
    "INSERT INTO items (title) VALUES ($1)", [item], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Что-то пошло не так");
      } else {
        res.redirect("/");
      }
    }
  );
});


// изменение item по ID и сохранение в БД
app.post("/edit", (req, res) => {
  const itemId = req.body.itemId;
  const newTitle = req.body.newTitle;
  db.query(
    "UPDATE items SET title = $1 WHERE id = $2", [newTitle, itemId], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Что-то пошло не так");
      } else {
        res.redirect("/");
      }
    }
  );
});

// удаление item по ID
app.post("/delete", (req, res) => {
  const itemId = req.body.itemId;
  db.query("DELETE FROM items WHERE id = $1", [itemId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Что-то пошло не так");
    } else {
      res.redirect("/");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
