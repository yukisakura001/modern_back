const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); //ハッシュ化するためのライブラリ
const jwt = require("jsonwebtoken"); //トークンを生成するためのライブラリ
require("dotenv").config(); //環境変数を使うためのライブラリ

const app = express(); // サーバー起動

const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成

const port = 5000;

app.use(express.json()); //json形式で受け取るための記述

//新規ユーザー登録API
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body; //json形式で受け取る

  const hashedPassword = await bcrypt.hashSync(password, 10); //10はハッシュ化の強度

  const user = await prisma.user.create({
    //レスポンスまで待つためにawaitをつける
    //userはテーブル名
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  return res.json({ user }); //json形式で返す
});

//ログインAPI
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  }); //emailが一致するものを検索

  if (!user) {
    return res.status(401).json({ error: "ない" }); //401は認証エラー
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password); //パスワードが一致するか確認

  if (!isPasswordValid) {
    return res.status(401).json({ error: "パスワードミス" }); //401は認証エラー
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "4w",
  }); //トークンを生成する

  return res.json({ token }); //トークンを返すのは次の動画で
});

app.listen(port, () => console.log(`Server is running on port ${port}`)); //第二変数でサーバー起動時の処理を記述
