// ここに認証に関するAPIを書いていきます

const router = require("express").Router(); //ルーター分けるための記述
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); //ハッシュ化するためのライブラリ
const jwt = require("jsonwebtoken"); //トークンを生成するためのライブラリ

const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成

//つぶやき投稿API
router.post("/register", async (req, res) => {
  const { content } = req.body; //json形式で受け取る

  if (!content) {
    return res.status(400).json({ error: "内容がない" }); //400はリクエストエラー
  }

  try {
    const newPost = await prisma.post.create({
      //postはテーブル名
      data: {
        content,
        authorId: 1, //仮置き
      },
    }); //データを作成
    res.status(201).json(newPost); //201は作成成功
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "サーバーエラー" }); //500はサーバーエラー
  }
});

//最近記事取得用API
router.post("/login", async (req, res) => {
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

module.exports = router; //routerをエクスポート
