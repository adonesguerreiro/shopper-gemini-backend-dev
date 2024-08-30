import { confirmSchema } from "./schema/confirmSchema";
import { MeasureType, PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { uploadSchema } from "./schema/uploadSchema";
import { gemini } from "./services/gemini";
import * as yup from "yup";
import { googleFileManager } from "./services/googleFileManager";
import cors from "cors";
import { uploadData } from "./interfaces/uploadData";
import { confirmData } from "./interfaces/confirmData";
import { customerData } from "./interfaces/customerData";

dotenv.config();

const app: Express = express();
const port = 5000;
const prisma = new PrismaClient();

app.use(express.json({ limit: "50mb" }));
app.use(cors());

interface UploadRequest extends Request {
	body: uploadData;
}
app.post("/upload", async (req: UploadRequest, res: Response) => {
	const { image, customer_code, measure_datetime, measure_type } = req.body;

	try {
		await uploadSchema.validate(req.body, { abortEarly: false });

		const [year, month] = measure_datetime.split("-").map(Number);

		const existsMonth = await prisma.consumption.findFirst({
			where: {
				AND: [
					{
						measure_datetime: {
							gte: new Date(year, month - 1, 1).toISOString(),
							lt: new Date(year, month, 1).toISOString(),
						},
					},
				],
			},
		});
		if (existsMonth) {
			return res.status(409).json({
				error_code: "DOUBLE_REPORT",
				error_description: "Leitura do mês já realizada",
			});
		}
		const googleFileResult = await googleFileManager(image);
		const geminiResult = await gemini(image);

		const measureCreated = await prisma.measure.create({
			data: {
				img_url: googleFileResult.getResponse.uri,
				measure_value: geminiResult,
			},
		});

		await prisma.consumption.create({
			data: {
				measure_datetime,
				measure_type,
				customer_code,
				measureId: measureCreated.measure_uuid,
			},
		});

		res.send({ measureCreated });
	} catch (err) {
		if (err instanceof yup.ValidationError) {
			const errorResponse = {
				errors: err.inner.map((error) => ({
					error_code: "INVALID_DATA",
					description: error.message,
				})),
			};
			return res.status(400).json(errorResponse);
		} else {
			console.error(err);
			res.status(500).json({ message: "Internal server error" });
		}
	}
});

interface ConfirmRequest extends Request {
	body: confirmData;
}

app.patch("/confirm", async (req: ConfirmRequest, res: Response) => {
	const { measure_uuid, confirmed_value } = req.body;

	try {
		await confirmSchema.validate(req.body, { abortEarly: false });

		const measureUUIDExists = await prisma.measure.findFirst({
			where: {
				measure_uuid: {
					equals: measure_uuid,
				},
			},
		});

		if (!measureUUIDExists) {
			return res.status(404).json({
				error_code: "MEASURE_NOT_FOUND",
				error_description: "Leitura do mês já realizada",
			});
		}

		const measureUUIDConfirmed = await prisma.measure.findFirst({
			where: {
				measure_uuid,
				confirmed_value,
			},
		});

		if (!measureUUIDConfirmed) {
			return res.status(409).json({
				error_code: "CONFIRMATION_DUPLICATE",
				error_description: "Leitura do mês já realizada",
			});
		}

		await prisma.measure.update({
			where: {
				measure_uuid: measure_uuid,
			},
			data: {
				confirmed_value,
			},
		});

		res.send({ success: true });
	} catch (err) {
		if (err instanceof yup.ValidationError) {
			const errorResponse = {
				errors: err.inner.map((error) => ({
					error_code: "INVALID_DATA",
					description: error.message,
				})),
			};
			return res.status(400).json(errorResponse);
		} else {
			console.error(err);
			res.status(500).json({ message: "Internal server error" });
		}
	}
});

interface CustomerRequest extends Request {
	body: customerData;
}
app.get("/:customer_code/list", async (req: CustomerRequest, res: Response) => {
	const { customer_code } = req.params;
	const { measure_type } = req.query;

	try {
		const measure_type_insensitive = measure_type
			? (measure_type as string).toUpperCase()
			: "";

		if (
			measure_type_insensitive !== "WATER" &&
			measure_type_insensitive !== "GAS" &&
			measure_type_insensitive !== ""
		) {
			return res.status(400).json({
				error_code: "INVALID_TYPE",
				error_description: "Tipo de medição não permitida",
			});
		}

		const consumptionExists = await prisma.consumption.findMany({
			where: {
				customer_code,
				...(measure_type_insensitive && {
					measure_type: {
						equals: measure_type_insensitive as "WATER" | "GAS",
					},
				}),
			},
			include: {
				measure: true,
			},
		});

		if (!consumptionExists || consumptionExists.length === 0) {
			return res.status(404).json({
				error_code: "MEASURES_NOT_FOUND",
				error_description: "Nenhuma leitura encontrada",
			});
		}

		const response = {
			customer_code: customer_code,
			measures: consumptionExists.map((item) => ({
				measure_uuid: item.measure.measure_uuid,
				measure_datetime: item.measure_datetime,
				measure_type: item.measure_type,
				has_confirmed: item.measure.confirmed_value != null,
				image_url: item.measure.img_url,
			})),
		};

		res.send(response);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

export default app;
