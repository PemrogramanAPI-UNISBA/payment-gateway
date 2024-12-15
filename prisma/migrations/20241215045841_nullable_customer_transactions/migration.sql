-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_transaction_id_fkey";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "transaction_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
