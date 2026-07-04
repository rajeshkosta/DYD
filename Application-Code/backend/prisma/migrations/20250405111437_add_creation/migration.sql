-- CreateTable
CREATE TABLE "Creation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Creation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Creation" ADD CONSTRAINT "Creation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
