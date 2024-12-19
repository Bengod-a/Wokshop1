-- DropForeignKey
ALTER TABLE `productoncart` DROP FOREIGN KEY `ProductOncart_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `productoncart` DROP FOREIGN KEY `ProductOncart_productId_fkey`;

-- AddForeignKey
ALTER TABLE `ProductOncart` ADD CONSTRAINT `ProductOncart_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOncart` ADD CONSTRAINT `ProductOncart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
