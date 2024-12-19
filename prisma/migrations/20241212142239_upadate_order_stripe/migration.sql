/*
  Warnings:

  - Made the column `currentcy` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` ALTER COLUMN `amount` DROP DEFAULT,
    ALTER COLUMN `status` DROP DEFAULT,
    ALTER COLUMN `stripePaymentId` DROP DEFAULT,
    MODIFY `currentcy` VARCHAR(191) NOT NULL;
