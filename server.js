const express = require("express");

const app = express(); // サーバー起動

const port = 5000;

app.get(
  "/",
  (req, res) => res.send("<h1>Hello World!</h1>") // タグを送信
);

app.listen(port, () => console.log(`Server is running on port ${port}`)); //第二変数でサーバー起動時の処理を記述
