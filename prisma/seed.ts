import { MeasureType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const measures = [
	{
		img_url: "https://example.com/images/1.jpg",
		measure_value: 120,
		measure_uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	},
	{
		img_url: "https://example.com/images/2.jpg",
		measure_value: 95,
		measure_uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
	},
	{
		img_url: "https://example.com/images/3.jpg",
		measure_value: 150,
		measure_uuid: "c3d4e5f6-a789-0123-cdef-234567890123",
	},
	{
		img_url: "https://example.com/images/4.jpg",
		measure_value: 200,
		measure_uuid: "d4e5f6a7-8901-2345-def6-345678901234",
	},
	{
		img_url: "https://example.com/images/5.jpg",
		measure_value: 175,
		measure_uuid: "e5f6a789-0123-4567-ef78-456789012345",
	},
	{
		img_url: "https://example.com/images/6.jpg",
		measure_value: 130,
		measure_uuid: "f6a78901-2345-6789-f012-567890123456",
	},
	{
		img_url: "https://example.com/images/7.jpg",
		measure_value: 110,
		measure_uuid: "a7890123-4567-8901-f234-678901234567",
	},
	{
		img_url: "https://example.com/images/8.jpg",
		measure_value: 160,
		measure_uuid: "b8901234-5678-9012-f345-789012345678",
	},
	{
		img_url: "https://example.com/images/9.jpg",
		measure_value: 140,
		measure_uuid: "c9012345-6789-0123-f456-890123456789",
	},
	{
		img_url: "https://example.com/images/10.jpg",
		measure_value: 185,
		measure_uuid: "d0123456-7890-1234-f567-901234567890",
	},
];

const consumptions = [
	{
		measureId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
		customer_code: "CUST001",
		measure_datetime: "2024-08-01T12:00:00Z",
		measure_type: MeasureType.WATER,
	},
	{
		measureId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
		customer_code: "CUST002",
		measure_datetime: "2024-08-02T12:00:00Z",
		measure_type: MeasureType.GAS,
	},
	{
		measureId: "c3d4e5f6-a789-0123-cdef-234567890123",
		customer_code: "CUST003",
		measure_datetime: "2024-08-03T12:00:00Z",
		measure_type: MeasureType.WATER,
	},
	{
		measureId: "d4e5f6a7-8901-2345-def6-345678901234",
		customer_code: "CUST004",
		measure_datetime: "2024-08-04T12:00:00Z",
		measure_type: MeasureType.GAS,
	},
	{
		measureId: "e5f6a789-0123-4567-ef78-456789012345",
		customer_code: "CUST005",
		measure_datetime: "2024-08-05T12:00:00Z",
		measure_type: MeasureType.WATER,
	},
	{
		measureId: "f6a78901-2345-6789-f012-567890123456",
		customer_code: "CUST006",
		measure_datetime: "2024-08-06T12:00:00Z",
		measure_type: MeasureType.GAS,
	},
	{
		measureId: "a7890123-4567-8901-f234-678901234567",
		customer_code: "CUST007",
		measure_datetime: "2024-08-07T12:00:00Z",
		measure_type: MeasureType.WATER,
	},
	{
		measureId: "b8901234-5678-9012-f345-789012345678",
		customer_code: "CUST008",
		measure_datetime: "2024-08-08T12:00:00Z",
		measure_type: MeasureType.GAS,
	},
	{
		measureId: "c9012345-6789-0123-f456-890123456789",
		customer_code: "CUST009",
		measure_datetime: "2024-08-09T12:00:00Z",
		measure_type: MeasureType.WATER,
	},
	{
		measureId: "d0123456-7890-1234-f567-901234567890",
		customer_code: "CUST010",
		measure_datetime: "2024-08-10T12:00:00Z",
		measure_type: MeasureType.GAS,
	},
];

async function main() {
	await prisma.measure.createMany({ data: measures, skipDuplicates: true });

	await prisma.consumption.createMany({
		data: consumptions,
		skipDuplicates: true,
	});
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
