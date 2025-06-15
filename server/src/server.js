import app from "./app.js";

// const app =require("app.js");
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servert running on port ${PORT}`);
});
