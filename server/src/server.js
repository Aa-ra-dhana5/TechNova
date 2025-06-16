import app from "./app.js";

// const app =require("app.js");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servert running on port ${PORT}`);
});
