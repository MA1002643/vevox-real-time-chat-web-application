DROP TABLE IF EXISTS `Questions`;
DROP TABLE IF EXISTS `Message`;
DROP TABLE IF EXISTS `Room`;
CREATE TABLE `Room` (
  `roomId` int(11) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `roomName` varchar(255) NOT NULL,
  PRIMARY KEY (`roomId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Message` (
  `messageId` int(11) NOT NULL AUTO_INCREMENT,
  `replyMessageId` int(11) DEFAULT NULL,
  `roomId` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `replyMessageIdRef` (`replyMessageId`),
  KEY `roomIdRef` (`roomId`),
  CONSTRAINT `replyMessageIdRef` FOREIGN KEY (`replyMessageId`) REFERENCES `Message` (`messageId`),
  CONSTRAINT `roomIdRef` FOREIGN KEY (`roomId`) REFERENCES `Room` (`roomId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

CREATE TABLE Questions(
    `questionId` int PRIMARY KEY REFERENCES `Message`(messageId),
    `Title` VARCHAR(1024) NOT NULL,
    `answerStatus` int NOT NULL DEFAULT 0,
    `answerMessageID` int,

    CONSTRAINT answerMessageID_messageID FOREIGN KEY (answerMessageID) REFERENCES `Message`(messageId)
);

INSERT INTO Room SET roomId=0, roomName = "Lecture 1";
INSERT INTO Room SET roomId=1, roomName = "Lecture 2";
INSERT INTO Message SET messageId=-1, `message` = "hi", roomId = 0;

-- Question 1
INSERT INTO Message SET messageId=-2, `message` = "question", roomId = 0;
INSERT INTO Questions SET questionId=-2, `Title` = "questionTitle";

-- Question 2
INSERT INTO Message SET messageId=-4, `message` = "AnotherQuestionAnswer", roomId = 0;
INSERT INTO Message SET messageId=-3, `message` = "AnotherQuestion", roomId = 0;
INSERT INTO Questions SET questionId=-3, `Title` = "AnotherQuestionTitle", answerMessageId = -4, answerStatus = 1;

-- Question 3
INSERT INTO Message SET messageId=-5, `message` = "questionToMarkUpdated", roomId = 0;
INSERT INTO Questions SET questionId=-5, `Title` = "questionToMarkUpdatedTitle";