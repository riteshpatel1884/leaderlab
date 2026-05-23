/*
  Warnings:

  - You are about to drop the `daily_topic_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prep_topics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prep_trackers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "daily_topic_logs" DROP CONSTRAINT "daily_topic_logs_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "prep_topics" DROP CONSTRAINT "prep_topics_tracker_id_fkey";

-- DropForeignKey
ALTER TABLE "prep_trackers" DROP CONSTRAINT "prep_trackers_application_id_fkey";

-- DropTable
DROP TABLE "daily_topic_logs";

-- DropTable
DROP TABLE "prep_topics";

-- DropTable
DROP TABLE "prep_trackers";
