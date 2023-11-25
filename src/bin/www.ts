import { config } from "dotenv";
config();
import app from "..";

(async function () {
  try {
    const port = process.env.PORT ?? 3001;
    app.listen(port, () => console.log(`app listening on port ${port}`));
  } catch (err) {
    console.log(err);
    throw err;
  }
})();
