import express, { Application, NextFunction , Request ,Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/error-handler";
import { ApiRoutes } from "./routes";
import studentRouter from "./routes/student.routes";
import courseRouter from "./routes/course.routes";
import { logger } from "./utils/logger";
import { StatusCode } from "./utils/consts";

const app: Application = express();

// Security: Set various HTTP headers to help protect the app
app.use(helmet());

// CORS: Allow cross-origin requests
app.use(cors());

// Logging: Log HTTP requests
app.use(morgan("combined"));

// Compression: Compress response bodies
app.use(compression());

// Rate Limiting: Limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser: Parse incoming request bodies in JSON format, with a limit of 10mb
app.use(
  express.json({
    limit: "10mb",
  })
);

app.disable('x-powered-by')

// Routes
app.use(ApiRoutes.BASE_STUDENT, studentRouter);
app.use(ApiRoutes.BASE_COURSE, courseRouter);
app.use("*", (req: Request, res: Response, _next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.error(`${fullUrl} endpoint does not exist`);
  res
    .status(StatusCode.NotFound)
    .json({ message: "The endpoint called does not exist." });
});

// Global error handler
app.use(errorHandler);

export default app;
