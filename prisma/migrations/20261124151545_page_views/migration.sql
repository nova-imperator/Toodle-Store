-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "product_slug" TEXT,
    "site" TEXT NOT NULL DEFAULT 'store',
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_created_at_idx" ON "page_views"("created_at");

-- CreateIndex
CREATE INDEX "page_views_product_slug_created_at_idx" ON "page_views"("product_slug", "created_at");
