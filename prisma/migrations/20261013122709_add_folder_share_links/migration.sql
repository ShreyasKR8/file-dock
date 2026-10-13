-- CreateTable
CREATE TABLE "folder_share_links" (
    "id" SERIAL NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "folder_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folder_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "folder_share_links_tokenHash_key" ON "folder_share_links"("tokenHash");

-- CreateIndex
CREATE INDEX "folder_share_links_folder_id_idx" ON "folder_share_links"("folder_id");

-- AddForeignKey
ALTER TABLE "folder_share_links" ADD CONSTRAINT "folder_share_links_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
