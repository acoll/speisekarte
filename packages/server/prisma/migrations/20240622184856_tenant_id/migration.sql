/*
  Warnings:

  - Added the required column `tenantId` to the `Eventstore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Eventstore" ADD COLUMN     "tenantId" TEXT NOT NULL;
