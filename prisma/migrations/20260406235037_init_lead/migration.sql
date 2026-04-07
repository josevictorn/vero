-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_lawyer_id_fkey";

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "lawyer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
