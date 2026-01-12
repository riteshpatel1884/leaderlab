/*
  Warnings:

  - You are about to drop the `Contribution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Issue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_userId_fkey";

-- DropTable
DROP TABLE "Contribution";

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "Issue";

-- DropEnum
DROP TYPE "ContributionStatus";

-- DropEnum
DROP TYPE "ContributionSubject";

-- DropEnum
DROP TYPE "FeedbackStatus";

-- DropEnum
DROP TYPE "IssueStatus";

-- DropEnum
DROP TYPE "IssueType";
