CREATE TABLE Questions(
    `questionId` int PRIMARY KEY REFERENCES `Message`(messageId),
    `Title` VARCHAR(1024) NOT NULL,
    `answerStatus` int NOT NULL DEFAULT 0,
    `answerMessageID` int,

    CONSTRAINT answerMessageID_messageID FOREIGN KEY (answerMessageID) REFERENCES `Message`(messageId)
);

ALTER TABLE `Message` DROP COLUMN `isQuestion`;