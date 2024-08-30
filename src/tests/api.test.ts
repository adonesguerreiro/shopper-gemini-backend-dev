import request from "supertest";
import app from "../../src/";

describe("PATCH /confirm read value valid", () => {
	it("should return 200", async () => {
		const res = await request(app).patch("/confirm").send({
			measure_uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
			confirmed_value: 235,
		});
		expect(res.status).toBe(200);
	});
});

describe("PATCH /confirm not sending measure_uuid field", () => {
	it("should return 400", async () => {
		const res = await request(app).patch("/confirm").send({
			confirmed_value: 235,
		});
		expect(res.status).toBe(400);
	});
});

describe("PATCH /confirm not sending confirmed value field", () => {
	it("should return 200", async () => {
		const res = await request(app).patch("/confirm").send({
			measure_uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
		});
		expect(res.status).toBe(400);
	});
});

describe("PATCH /confirm read value invalid measure uuid", () => {
	it("should return 404", async () => {
		const res = await request(app).patch("/confirm").send({
			measure_uuid: "75d2caa5-0d43-4ff4-b075-cbd5f2cb09b4",
			confirmed_value: 120,
		});
		expect(res.status).toBe(404);
	});
});

describe("PATCH /confirm read value valid", () => {
	it("should return 409", async () => {
		const res = await request(app).patch("/confirm").send({
			measure_uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
			confirmed_value: 310,
		});
		expect(res.status).toBe(409);
	});
});

describe("GET /:customer_code/list", () => {
	it("should return customer details", async () => {
		const res = await request(app).get("/CUST001/list");
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("customer_code");
	});
});

describe("GET /:customer_code/list with query parameters", () => {
	it("should return customer details with query parameters", async () => {
		const res = await request(app).get("/CUST001/list?measure_type=GAS");
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("customer_code");
	});
});

describe("GET /:customer_code/list with customer code invalid", () => {
	it("should return 404 when customer code is not found", async () => {
		const res = await request(app).get("/CUST001/list?measure_type=SODA");
		expect(res.status).toBe(400);
	});
});

describe("GET /:customer_code/list with customer code invalid", () => {
	it("should return 404 when customer code is not found", async () => {
		const res = await request(app).get("/787987/list");
		expect(res.status).toBe(404);
	});
});
