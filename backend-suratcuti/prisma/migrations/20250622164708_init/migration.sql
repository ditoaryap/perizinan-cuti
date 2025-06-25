-- CreateEnum
CREATE TYPE "Role" AS ENUM ('pegawai', 'admin');

-- CreateEnum
CREATE TYPE "StatusCuti" AS ENUM ('DIAJUKAN', 'DISETUJUI', 'DITOLAK');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT,
    "jabatan" TEXT,
    "role" "Role" NOT NULL DEFAULT 'pegawai',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisCuti" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "maxHari" INTEGER NOT NULL DEFAULT 12,

    CONSTRAINT "JenisCuti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KuotaCuti" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jenisCutiId" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "totalKuota" INTEGER NOT NULL,
    "sisaKuota" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KuotaCuti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutiRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jenisCutiId" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "alasan" TEXT NOT NULL,
    "status" "StatusCuti" NOT NULL DEFAULT 'DIAJUKAN',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CutiRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nip_key" ON "User"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "JenisCuti_nama_key" ON "JenisCuti"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "KuotaCuti_userId_jenisCutiId_tahun_key" ON "KuotaCuti"("userId", "jenisCutiId", "tahun");

-- AddForeignKey
ALTER TABLE "KuotaCuti" ADD CONSTRAINT "KuotaCuti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KuotaCuti" ADD CONSTRAINT "KuotaCuti_jenisCutiId_fkey" FOREIGN KEY ("jenisCutiId") REFERENCES "JenisCuti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutiRequest" ADD CONSTRAINT "CutiRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutiRequest" ADD CONSTRAINT "CutiRequest_jenisCutiId_fkey" FOREIGN KEY ("jenisCutiId") REFERENCES "JenisCuti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
