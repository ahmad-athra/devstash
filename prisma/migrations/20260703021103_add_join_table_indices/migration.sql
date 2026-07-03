-- CreateIndex
CREATE INDEX "items_on_collections_collectionId_idx" ON "items_on_collections"("collectionId");

-- CreateIndex
CREATE INDEX "tags_on_items_tagId_idx" ON "tags_on_items"("tagId");
