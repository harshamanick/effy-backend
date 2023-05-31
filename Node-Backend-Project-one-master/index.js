import express from "express";
import Route from "./startup/Routes.js";
import Db from "./startup/Db.js";
import NodeGeocoder from "node-geocoder";

const App = express();
Route(App);
Db();

const port = process.env.PORT || 3000;

App.listen(port, () => {
  console.log(`listerning on port ${port}`);
});
