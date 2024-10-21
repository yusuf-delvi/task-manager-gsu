import express, { Request, Response, NextFunction } from 'express';
import swagger from 'swagger-ui-express';
import fs from 'fs';
import Logger from './core/Logger';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database'; // initialize database
import {
	NotFoundError,
	ApiError,
	InternalError,
	ErrorType,
} from './core/ApiError';
import routes from './routes';

process.on('uncaughtException', (e) => {
	Logger.error(e);
});

const app = express();

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));

app.use('/docs', swagger.serve, swagger.setup(swaggerDocument));

app.use(express.json({ limit: '10mb' }));
app.use(
	express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ApiError) {
		ApiError.handle(err, res);
		if (err.type === ErrorType.INTERNAL)
			Logger.error(
				`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
			);
	} else {
		Logger.error(
			`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
		);
		Logger.error(err);
		if (environment === 'development') {
			return res.status(500).send(err);
		}
		ApiError.handle(new InternalError(), res);
	}
});

export default app;
