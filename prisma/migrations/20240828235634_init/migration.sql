-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "Consumption" (
    "id" SERIAL NOT NULL,
    "customer_code" VARCHAR(255) NOT NULL,
    "measure_datetime" VARCHAR(255) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "measureId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measure" (
    "measure_uuid" UUID NOT NULL,
    "img_url" VARCHAR(255) NOT NULL,
    "measure_value" VARCHAR(255) NOT NULL,
    "confirmed_value" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("measure_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Measure_measure_uuid_key" ON "Measure"("measure_uuid");

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "Measure"("measure_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
