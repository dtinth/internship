# rating categories
INSERT INTO `rating_categories`(`id`, `name`, `description`, `order`) VALUES (1,'Environment','How is workplace environment?',1);
INSERT INTO `rating_categories`(`id`, `name`, `description`, `order`) VALUES (2,'Employee/Mentor','Was they helpful/Kind?',2);
INSERT INTO `rating_categories`(`id`, `name`, `description`, `order`) VALUES (3,'Task/Research', 'Was the task interesting?',3);
INSERT INTO `rating_categories`(`id`, `name`, `description`, `order`) VALUES (4,'Transportation','Was it easy to get to work?',4);
INSERT INTO `rating_categories`(`id`, `name`, `description`, `order`) VALUES (5,'Educational Benefits','Did your skill improve?',5);
INSERT INTO `rating_categories`(`id`, `name`, `description`, `order`) VALUES (6,'Overall','Overall satification?',6);

# tag_ctegories
INSERT INTO `tag_categories`(`id`, `name`, `order`) VALUES (1,'Paid',1);
INSERT INTO `tag_categories`(`id`, `name`, `order`) VALUES (2,'Country',2);
INSERT INTO `tag_categories`(`id`, `name`, `order`) VALUES (3,'Working hours',3);
INSERT INTO `tag_categories`(`id`, `name`, `order`) VALUES (4,'Type of work',4);
INSERT INTO `tag_categories`(`id`, `name`, `order`) VALUES (5,'Programming language',5);
INSERT INTO `tag_categories`(`id`, `name`, `order`) VALUES (6,'Field of work',6);

# tags
	# Paid
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (1,1,'Non-Paid');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (2,1,'Paid');
	# Country
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (3,2,'Austria');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (4,2,'England');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (5,2,'Finland');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (6,2,'France');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (7,2,'Germany');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (8,2,'Japan');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (9,2,'Korea');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (10,2,'Thailand');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (11,2,'United States');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (12,2,'Vietnam');
	# Working Hours
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (13,3,'Fix');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (14,3,'Flexible');
	# Type of work
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (15,4,'Research');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (16,4,'Project');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (17,4,'It support');
	# Programming language
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (18,5,'Assembly');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (19,5,'C');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (20,5,'C#');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (21,5,'C++');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (22,5,'CSS');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (23,5,'HTML');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (24,5,'Java');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (25,5,'JavaScript');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (26,5,'Objective-C');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (27,5,'PHP');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (28,5,'Python');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (29,5,'Ruby');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (30,5,'SQL');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (31,5,'Swift');
	# field of work
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (32,6,'Artificial Intelligence');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (33,6,'Business Analyst');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (34,6,'Business Intelligence');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (35,6,'Computer Security');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (36,6,'Database Design');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (37,6,'Desktop App Dev');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (38,6,'Game Development');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (39,6,'Graphic Design');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (40,6,'Image Processing');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (41,6,'Mobile Dev - Andriod');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (42,6,'Mobile Dev - iOS');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (43,6,'Networking / System Admin');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (44,6,'Quality Assurance / Testing');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (45,6,'Technical Writing');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (46,6,'Web Development');
INSERT INTO `tags`(`id`, `tag_category_id`, `value`) VALUES (47,6,'Webmaster / Web Design');

DROP TABLE tag_review;
DROP TABLE tags;
DROP TABLE tag_categories;
DROP TABLE ratings;
DROP TABLE rating_categories;
DROP TABLE reviews;
DROP TABLE places;
DROP TABLE students;
DROP TABLE files;

