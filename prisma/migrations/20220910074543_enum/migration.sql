/*
  Warnings:

  - You are about to drop the column `maritalStatus` on the `User` table. All the data in the column will be lost.
  - Changed the type of `address` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "pin" DROP DEFAULT,
ALTER COLUMN "accountBalance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "maritalStatus",
ALTER COLUMN "middleName" DROP NOT NULL,
ALTER COLUMN "profilePicture" DROP NOT NULL,
DROP COLUMN "address",
ADD COLUMN     "address" JSONB NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
