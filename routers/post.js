// ここに認証に関するAPIを書いていきます

const router = require("express").Router(); //ルーター分けるための記述
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); //ハッシュ化するためのライブラリ
const jwt = require("jsonwebtoken"); //トークンを生成するためのライブラリ
const isAuthenticated = require("../middlewares/isAuthenticated"); //認証用のミドルウェア

const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成

//つぶやき投稿API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body; //json形式で受け取る

  if (!content) {
    return res.status(400).json({ message: "内容がない" }); //400はリクエストエラー
  }

  try {
    const newPost = await prisma.post.create({
      //postはテーブル名
      data: {
        content,
        authorId: req.userId, //middolewareで定義したreq.userIdを使う
      },
      include: {
        author: true, //authorを含める
      },
    }); //データを作成
    res.status(201).json(newPost); //201は作成成功
  } catch (e) {
    res.status(500).json({ message: "サーバーエラー" }); //500はサーバーエラー
  }
});

//最近記事取得用API
router.get("/get_latest_posts", async (req, res) => {
  //取得であるためGET

  try {
    const latestPost = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true, //authorを含める
      },
      take: 10,
    });
    res.status(200).json(latestPost); //200は成功
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "サーバーエラー" }); //500はサーバーエラー
  }
});

module.exports = router; //routerをエクスポート
