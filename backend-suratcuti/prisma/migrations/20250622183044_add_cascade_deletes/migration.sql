-- DropForeignKey
ALTER TABLE "CutiRequest" DROP CONSTRAINT "CutiRequest_jenisCutiId_fkey";

-- DropForeignKey
ALTER TABLE "CutiRequest" DROP CONSTRAINT "CutiRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "KuotaCuti" DROP CONSTRAINT "KuotaCuti_jenisCutiId_fkey";

-- DropForeignKey
ALTER TABLE "KuotaCuti" DROP CONSTRAINT "KuotaCuti_userId_fkey";

-- AddForeignKey
ALTER TABLE "KuotaCuti" ADD CONSTRAINT "KuotaCuti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KuotaCuti" ADD CONSTRAINT "KuotaCuti_jenisCutiId_fkey" FOREIGN KEY ("jenisCutiId") REFERENCES "JenisCuti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutiRequest" ADD CONSTRAINT "CutiRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutiRequest" ADD CONSTRAINT "CutiRequest_jenisCutiId_fkey" FOREIGN KEY ("jenisCutiId") REFERENCES "JenisCuti"("id") ON DELETE CASCADE ON UPDATE CASCADE;
