import { MeasureType } from "@prisma/client";

export interface uploadData {
	image: string;
	customer_code: string;
	measure_datetime: string;
	measure_type: MeasureType;
}
