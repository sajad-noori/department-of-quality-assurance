-- Add video_link column to docs_center_and_uploads table
ALTER TABLE docs_center_and_uploads 
ADD COLUMN video_link VARCHAR(255) NULL 
AFTER description; 