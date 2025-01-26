/*
  Warnings:

  - You are about to drop the column `pricePerDay` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Rental` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_productId_fkey";

-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_userId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "pricePerDay",
DROP COLUMN "stock";

-- DropTable
DROP TABLE "Rental";
