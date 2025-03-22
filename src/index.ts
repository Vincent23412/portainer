import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import containerRouter from "./routers/containerRouter";
import morgan from "morgan";

dotenv.config();
async function main() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.static("public"));
  app.use("/container", containerRouter);

  app.get("/", (req: Request, res: Response) => {
    res.send(process.env.test);
  });

  app.get("/health", (req: Request, res: Response) => {
    res.send("health");
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    error.status = 404;
    next(error);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);

    res.status(err.status || 500).json({
      error: "Unhandled error",
      message: err.message || "An unknown error occurred",
    });
  });
  
  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
}

main().catch((e) => console.log(e));
