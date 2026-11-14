-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cod_fee" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false;
