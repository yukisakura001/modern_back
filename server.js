const express = require("express");
const authRoute = require("./routers/auth"); //ルーターを読み込む
const cors = require("cors"); //CORSを許可するためのライブラリ
const postRoute = require("./routers/post"); //ルーターを読み込む
const usersRoute = require("./routers/user"); //ルーターを読み込む

require("dotenv").config(); //環境変数を使うためのライブラリ

const app = express(); // サーバー起動

const port = 5000;

app.use(cors()); //CORSを許可するための記述

app.use(express.json()); //json形式で受け取るための記述

app.use("/api/auth", authRoute); //ルーターを読み込む（auth）
app.use("/api/posts", postRoute); //ルーターを読み込む（post）
app.use("/api/users", usersRoute); //ルーターを読み込む（users）

app.listen(port, () => console.log(`Server is running on port ${port}`)); //第二変数でサーバー起動時の処理を記述
