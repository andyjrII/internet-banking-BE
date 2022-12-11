/*
  Warnings:

  - You are about to drop the column `transferFrom` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `Occupation` on the `User` table. All the data in the column will be lost.
  - Added the required column `occupation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transferFrom";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Occupation",
ADD COLUMN     "occupation" TEXT NOT NULL;
