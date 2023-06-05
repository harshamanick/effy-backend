import express from "express";
import Route from "./startup/Routes.js";
import Db from "./startup/Db.js";

const App = express();
Route(App);
Db();

const port = process.env.PORT || 3000;

App.listen(port, () => {
  console.log(`listening on port ${port}`);
});
