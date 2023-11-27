import { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: "development" | "test" | "production";
      CORS_LIST: string;
      TS_NODE_IGNORE_DIAGNOSTICS: "2339" | string;
      SECRET: Secret | string;
      IMAGEKIT_PRIVATE_KEY: string;
      IMAGEKIT_PUBLIC_KEY: string;
      IMAGEKIT_ENDPOINT_URL: string;
    }
  }
}
