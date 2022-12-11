/*
  Warnings:

  - The `accountType` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `from` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Transaction` table. All the data in the column will be lost.
  - Changed the type of `accountBalance` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `transferFrom` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transferTo` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `transactionType` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `gender` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CURRENT', 'FIXED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accountType",
ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'SAVINGS',
DROP COLUMN "accountBalance",
ADD COLUMN     "accountBalance" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "transferFrom" TEXT NOT NULL,
ADD COLUMN     "transferTo" TEXT NOT NULL,
DROP COLUMN "transactionType",
ADD COLUMN     "transactionType" "TransactionType" NOT NULL,
DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "updatedAt" SET NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
