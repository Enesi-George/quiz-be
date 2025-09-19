import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { databaseTestConnection } from "./config/database";
import authlessRoute from "./routes/authlessRoute";
import authRoute from "./routes/authRoute";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

//security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL?.split(",") || ["https://quiz-app-livid-alpha.vercel.app"]
      : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

//routes
app.use("/api/auth", authlessRoute);
app.use("/api/public", authlessRoute); // Public quiz routes
app.use("/api", authRoute);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});


//database check and server init
app.listen(PORT, async() => {
  try {
    await databaseTestConnection();
    console.log(`Server is running on port ${PORT}`);
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode - CORS enabled for localhost");
    }
    if (process.env.NODE_ENV === "production") {
      console.log("Production mode");
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});
