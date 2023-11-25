import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import { format, utcToZonedTime } from "date-fns-tz";
import AppError from "./middlewares/error";
import ErrorHandler from "./middlewares/errorHandler";
import router from "./routes";
import { baseUrl } from "./constant";
import notFoundRoutes from "./middlewares/notFoundRoute";

const app = express();

app.use(
  helmet({
    referrerPolicy: { policy: "same-origin" },
  })
);
app.use(
  cors({
    origin(requestOrigin, callback) {
      const whiteList = process.env.CORS_LIST ?? "";
      if (whiteList.indexOf(requestOrigin as string) !== -1) {
        callback(null, true);
      } else {
        callback(
          new AppError({
            message: `Not allowed by CORS for URL ${requestOrigin}`,
            statusCode: 403,
          })
        );
      }
    },
  })
);
morgan.token("date", () =>
  format(
    utcToZonedTime(new Date(), "Asia/Jakarta"),
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
  )
);
morgan.format(
  "production",
  '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
);
morgan.format(
  "dev",
  '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
);
app.use(morgan("combined"));
app.use(express.static("public"));
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 100000000,
  })
);
app.disable("x-powered-by");
app.use(baseUrl, router);
app.use("/*", notFoundRoutes);
app.use(ErrorHandler);

export default app;
