/*
  Warnings:

  - Made the column `folder_id` on table `folder_share_links` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "folder_share_links" DROP CONSTRAINT "folder_share_links_folder_id_fkey";

-- AlterTable
ALTER TABLE "folder_share_links" ALTER COLUMN "folder_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "folder_share_links" ADD CONSTRAINT "folder_share_links_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
