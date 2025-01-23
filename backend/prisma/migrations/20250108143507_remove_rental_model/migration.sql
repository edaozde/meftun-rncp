/*
  Warnings:

  - You are about to drop the `Rental` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_productId_fkey";

-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_userId_fkey";

-- DropTable
DROP TABLE "Rental";
