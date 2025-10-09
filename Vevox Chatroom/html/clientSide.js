let activeRoom = -1;
let selfRef = {};
let socket;

let messageSendIsQuestion = false;

// ids of replies that are answers, used for lookup during initial
// message gathering, this is because we recieve the question first
// then we recieve the replies, so we just need a list of ids to
// look for to set them as the answer when they are received
let questionAnswerMessageIds = [];

createWebsocket = () => {
    socket = new WebSocket("ws://localhost:8000");
    socket.onmessage = (data) => {
        body = JSON.parse(data.data);
        console.log(body);
        switch (body["eventType"]) {
            case "Connection Ready":
                console.log("Received Confirmation");
                let newData = {
                    "eventType": "getAllRooms",
                };
                let newBody = JSON.stringify(newData);
                socket.send(newBody);
                break;
            case "Initialization":
                selfRef = {
                    "name": body["name"],
                    "sessionId": body["sessionId"],
                    "websocketConnection": this.socket
                };
                break;
            case "Loaded Messages":
                //alert("Got the messages");
                for (let i = 0; i < body["event"].length; i++) {
                    if (body["event"][i]["replyMessageId"] != null)
                        createReply(body["event"][i]["messageId"], body["event"][i]["message"], body["event"][i]["replyMessageId"]);
                    else if (body["event"][i]["isQuestion"]) {
                        if (body["event"][i]["answerMessageID"] != null)
                            questionAnswerMessageIds += body["event"][i]["answerMessageID"];

                        createQuestion(body["event"][i]["message"], false, body["event"][i]["messageId"], body["event"][i]["answerMessageID"]);
                    }
                    else
                        createMessage(body["event"][i]["message"]);
                }
                break;
            case "newMessage":
                // This is repeated code from above but some of the names are different, so it isn't
                // reasonable to merge it
                if (body["event"]["replyToId"] != null)
                    createReply(body["event"]["messageId"], body["event"]["message"], body["event"]["replyToId"], body["event"]["isOwnMessage"])
                else if (body["event"]["isQuestion"])
                    createQuestion(body["event"]["message"], body["event"]["isOwnMessage"], body["event"]["messageId"], null);
                else
                    createMessage(body["event"]["message"], body["event"]["isOwnMessage"]);
                break;
            case "getAllRooms":
                //alert("Got the rooms");
                for (let i = 0; i < body["event"].length; i++) {
                    addRoom(body["event"][i]["roomId"], body["event"][i]["roomName"]);
                }
                break;
            case "markAnswerQuestion":
                // update question to set it as completed (apply finished class)
                document.getElementById(`Question${body["event"]["questionId"]}`).className += " answeredQuestion";

                // Update the reply to show that it is answered
                let replyElement = document.getElementById(`Question${body["event"]["questionId"]}ReplyId${body["event"]["answerMessageId"]}`);
                replyElement.className = "questionReplyAnswer";
                replyElement.innerHTML += " (answer)";
                break;
            default:
                throw "Invalid event type: " + body["eventType"];
        }
    };
    socket.onclose = () => {
        console.log("Websocket has closed, attempting to reconnect");
        setTimeout(() => createWebsocket(), 1000);
    };
    socket.onopen = () => {
        console.log("Opened websocket");
    };
}

window.onload = () => {
    createWebsocket();
    /* Selection of question/answer */

    document.getElementById("select-category-question").addEventListener("click", () => {
        list.classList.toggle("newlist");
        document.getElementById("selected-message-category").innerHTML = "Sending as a Question";
        messageSendIsQuestion = true;
    });

    document.getElementById("select-category-message").addEventListener("click", () => {
        list.classList.toggle("newlist");
        document.getElementById("selected-message-category").innerHTML = "Sending as a Message";
        messageSendIsQuestion = false;
    });

    document.getElementById("send-btn").addEventListener("click", function () {
        console.log("send-btn");
        let messageContent = document.getElementById("send-msg").value;
        if (messageContent != "") sendMessage(messageContent, null, messageSendIsQuestion);
        //createMessage(messageContent, true);
    });
}

const sendMessage = (messageContent, replyMessageId = null, sendAsQuestion) => {
    let request = "";
    if (!sendAsQuestion)
        request = new CreateNewMessageEvent(messageContent, activeRoom, replyMessageId);
    else
        request = new CreateNewQuestionEvent("TITLE", messageContent, activeRoom);

    let newBody = JSON.stringify(request);
    socket.send(newBody);
}

const createMessage = (messageContent, isOwnMessage = false) => {
    let messageClass = isOwnMessage ? "messageText" : "message";
    let newHTML = "";
    newHTML += "<div class=" + messageClass + ">";
    newHTML += messageContent;
    newHTML += "</div>";

    document.getElementById("messageContainer").insertAdjacentHTML("beforeend", newHTML);
}

const createQuestion = (messageContent, isOwnQuestion, messageId, answerMessageId) => {
    console.log(isOwnQuestion);
    let messageClass = isOwnQuestion ? "messageText" : "message";

    if (answerMessageId != null)
        messageClass += " answeredQuestion"

    let newHTML = `<div class=\"${messageClass}\" id=\"Question${messageId}\">
<div class=\"questionContent\">
    <div class=\"questionTitle\">
        QUESTION: ${messageContent}
    </div>
    <br>
    Responses:
    <br>
    <div class=\"questionReplies\" />
    <form class="questionReplyForm" id="${messageId}-replyform">
        <input id="text" type="text" placeholder=\"Type your reply here\" />
    </form>
</div>`;

    // this will preserve listeners compared to appending to innerHTML
    document.getElementById("messageContainer").insertAdjacentHTML("beforeend", newHTML);

    console.log(`${messageId}-replybox`);
    document.getElementById(`${messageId}-replyform`).addEventListener("submit", (e) => {
        e.preventDefault();
        //alert(`pressed`);
        sendMessage(e.target.elements["text"].value, messageId, false);
    });
}

const markResponseAsAnswer = (questionId, replyMessageId) => {
    let request = new MarkQuestionAnswerEvent(questionId, replyMessageId);

    let newBody = JSON.stringify(request);
    socket.send(newBody);
}

const createReply = (messageId, messageContent, replyMessageId, isOwnMessage = false) => {
    // Find either a question or a message with this id
    let question = document.getElementById(`Question${replyMessageId}`);
    let message = document.getElementById(`Message${replyMessageId}`);

    let prefix = isOwnMessage ? "Own Message:" : "";

    let divClass = "";
    if (questionAnswerMessageIds.includes(messageId)) {
        // this is the answer
        messageContent += " (answer)";
        divClass = "questionReplyAnswer";
    }
    else
        divClass = isOwnMessage ? "questionReplyOwn" : "questionReply";

    if (question != undefined) {
        let html = `<div id="Question${replyMessageId}ReplyId${messageId}" class="${divClass}">${prefix + messageContent}<button class="markAsAnswerButton" onclick="markResponseAsAnswer(${replyMessageId}, ${messageId})">Mark as answer</button></div>`;

        question.getElementsByClassName("questionReplies")[0].insertAdjacentHTML("beforebegin", html);
    }
    else {
        //alert("question not found: " + messageId);
        // TODO
    }
}

const addRoom = (roomId, roomName) => {
    let newHTML = "";
    newHTML += "<li id=\"" + roomId + "\" onClick=\"roomClicked(this.id)\">";
    newHTML += roomName;
    newHTML += "</li>";

    document.getElementById("roomList").innerHTML += newHTML;
}

const roomClicked = (roomId) => {
    if (roomId == activeRoom) return;

    document.getElementById("messageContainer").innerHTML = "";
    //alert(roomId);
    activeRoom = roomId;
    let newData = {
        "eventType": "getMessages",
        "event": {
            "roomId": roomId
        }
    };
    let newBody = JSON.stringify(newData);
    console.log(socket);
    socket.send(newBody);

    let mobile = window.matchMedia("(max-width: 700px)");
    if (mobile.matches) {
        document.getElementById("mobile-menu").classList.toggle("is-active");
        document.getElementById("mobile-menu").classList.toggle("active");
        document.getElementById("myNavbar").classList.toggle("active");
    }

}