// MessageEvents - all of the events that can be sent using websockets. I am consilidating them in classes
// to make it easier for changes to be made to them (so requiring changes to the constructor)

class CreateNewMessageEvent {
    constructor(messageText, roomId, replyTo) {
        this.eventType = "message";
        this.event = {
            "message": messageText,
            "roomId" : roomId,
            "replyTo": replyTo
        };
    }
}

class RequestAllMessages {
    constructor(roomId) {
        this.eventType = "getMessages";
        this.event = {
            "roomId": roomId
        };
    }
}

class CreateNewQuestionEvent {
    constructor(title, messageText, roomId) {
        this.eventType = "createQuestion";
        this.event = {
            "title": title,
            "message": messageText,
            "roomId" : roomId,
        }
    }
}

class MarkQuestionAnswerEvent {
    constructor(questionId, answerMessageId) {
        this.eventType = "markAnswerQuestion";
        this.event = {
            "questionId": questionId,
            "answerMessageId": answerMessageId,
        }
    }
}

class MarkQuestionAnswerResponse {
    constructor(questionId, answerMessageId) {
        this.eventType = "markAnswerQuestion";
        this.event = {
            "questionId": questionId,
            "answerMessageId": answerMessageId,
        }
    }
}



class MessageAcknowledgement {
    constructor(messageText, roomId) {
        this.eventType = "messageAcknowledgement";
        this.event = {
            "message": messageText,
            "roomId" : roomId
        }
    }
}

class QuestionAcknowledgement {
    constructor(title, messageText, roomId) {
        this.eventType = "questionAcknowledgement";
        this.event = {
            "title": title,
            "message": messageText,
            "roomId" : roomId,
        }
    }
}

class ClientRecieveNewMessage {
    constructor(messageId, messageText, isQuestion, replyToId, isOwnMessage = false) {
        this.eventType = "newMessage";
        this.event = {
            "messageId": messageId,
            "isQuestion": isQuestion,
            "message": messageText,
            "replyToId": replyToId,
            "isOwnMessage": isOwnMessage
        }
    }
}

class GetAllMessagesResponse {
    constructor(messages) {
        this.eventType = "Loaded Messages";
        this.event = messages
    }
}

class GetAllRoomsResponse {
    constructor(rooms) {
        this.eventType = "getAllRooms";
        this.event = rooms
    }
}

class RequestAllRoomsEvent {
    constructor() {
        this.eventType = "getAllRooms";
    }
}

try
{
    module.exports = {
        CreateNewMessageEvent,
        GetAllMessagesResponse,
        MessageAcknowledgement,
        ClientRecieveNewMessage,
        GetAllRoomsResponse,
        RequestAllRoomsEvent,
        RequestAllMessages,
        CreateNewQuestionEvent,
        MarkQuestionAnswerEvent,
        MarkQuestionAnswerResponse,
        QuestionAcknowledgement
    }
}
catch (e)
{

}