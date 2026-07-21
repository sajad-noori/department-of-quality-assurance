-- Migration: add "letter" (مکاتیب) as a valid category for docs_center_and_uploads
-- Run this once against your database. Safe to run on the live DB; it only
-- widens the enum, it does not touch existing rows.

ALTER TABLE `docs_center_and_uploads`
  MODIFY COLUMN `category`
  ENUM('guideline','form','legal','check-list','standards','letter')
  NOT NULL;
