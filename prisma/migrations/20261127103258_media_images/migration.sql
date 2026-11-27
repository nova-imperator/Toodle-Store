-- CreateTable
CREATE TABLE "media_images" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT 'image/webp',
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_images_pkey" PRIMARY KEY ("id")
);
