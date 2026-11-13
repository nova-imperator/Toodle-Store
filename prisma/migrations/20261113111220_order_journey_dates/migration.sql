-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cancelled_at" TIMESTAMP(3),
ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "packed_at" TIMESTAMP(3),
ADD COLUMN     "placed_at" TIMESTAMP(3),
ADD COLUMN     "shipped_at" TIMESTAMP(3);
