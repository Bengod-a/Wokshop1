/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `productoncart` DROP FOREIGN KEY `ProductOncart_productId_fkey`;

-- AlterTable
ALTER TABLE `product` MODIFY `title` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_title_key` ON `Product`(`title`);

-- AddForeignKey
ALTER TABLE `ProductOncart` ADD CONSTRAINT `ProductOncart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
