import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { databaseTestConnection } from "./config/database";
import authlessRoute from "./routes/authlessRoute";
import authRoute from "./routes/authRoute";
import { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();
const app = express();

// security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL?.split(",") || [
          "https://quiz-app-livid-alpha.vercel.app",
        ]
      : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use("/api/auth", authlessRoute);
app.use("/api/public", authlessRoute); // Public quiz routes
app.use("/api", authRoute);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// global error handler
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);

    // res.status(500).json({
    //   error: "Internal server error",
    //   message:
    //     process.env.NODE_ENV === "development"
    //       ? error.message
    //       : "Something went wrong",
    // });
    res.status(500).json({
      error: "Internal server error",
      message: error,
      stack: error.stack,
    });
  }
);

// Export handler for Vercel
// export default app;
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req as any, res as any);
};

//For local dev only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8080;

  (async () => {
    try {
      await databaseTestConnection();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  })();
}
