/*
  Warnings:

  - You are about to drop the column `localGovt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stateOfOrigin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "accountBalance" SET DEFAULT 1000;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "localGovt",
DROP COLUMN "stateOfOrigin";
