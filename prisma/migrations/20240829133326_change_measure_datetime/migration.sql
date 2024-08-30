/*
  Warnings:

  - Changed the type of `measure_datetime` on the `Consumption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Consumption" DROP COLUMN "measure_datetime",
ADD COLUMN     "measure_datetime" TIMESTAMP(3) NOT NULL;
