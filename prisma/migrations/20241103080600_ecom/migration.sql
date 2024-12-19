/*
  Warnings:

  - You are about to drop the column `orserStatus` on the `order` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to drop the column `pricd` on the `productoncart` table. All the data in the column will be lost.
  - Added the required column `price` to the `ProductOncart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `orserStatus`,
    ADD COLUMN `orderStatus` VARCHAR(191) NOT NULL DEFAULT 'not process';

-- AlterTable
ALTER TABLE `product` MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `productoncart` DROP COLUMN `pricd`,
    ADD COLUMN `price` DOUBLE NOT NULL;
