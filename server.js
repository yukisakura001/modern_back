const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express(); // サーバー起動

const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成

const port = 5000;

//新規ユーザー登録API
app.post("/api/auth/register", (req, res) => {
  const { username, email, password } = req.body; //json形式で受け取る
  const user = prisma.user.create({
    //userはテーブル名
    data: {
      username,
      email,
      password,
    },
  });
  return res.json(user); //json形式で返す
});

app.listen(port, () => console.log(`Server is running on port ${port}`)); //第二変数でサーバー起動時の処理を記述
