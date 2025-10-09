const WebSocket = require('ws');
const fs = require('fs');
const uuid = require('uuid');

var messageEvents = require("./html/MessageEvents.js");

const mysql = require('mysql2/promise');
const { stringify } = require('querystring');
console.log(process.env.DATABASE_USER);

class Client {
    constructor(name, sessionId) {
        this.name = name;
        this.sessionId = sessionId;
        this.webSocketConnection = null;
        this.clientState = ClientState.NotAuthenticated;
    }
}
const ClientState = {
    NotAuthenticated: 0,
    Authenticated: 1
}

webSocketSessions = {}

const notifyClientsOfNewMessage = (creatorWebSocket, messageId, isQuestion, content, replyTo) => {
    let newData = new messageEvents.ClientRecieveNewMessage(messageId, content, isQuestion, replyTo);
    let newBody = JSON.stringify(newData);
    for ([sessionID, client] of Object.entries(webSocketSessions)) {
        if (client.webSocketConnection != creatorWebSocket) 
            client.webSocketConnection.send(newBody);
        else
        {
            // send a custom json if we sent it
            let customResponse = new messageEvents.ClientRecieveNewMessage(result.insertId, content, isQuestion, replyTo, true);
            let customString = JSON.stringify(customResponse);
            client.webSocketConnection.send(customString);
        }
    }
}

webSocketServer = null;

startWebSocketServer = () =>
{
    webSocketServer = new WebSocket.Server({ port: 8000 });
    console.log(webSocketServer.address());
    webSocketServer.on("connection", (ws) => {
        let nextSessionId = uuid.v4(); // It's safe to assume this will never be equal to a value already in the dictionary (Also v5 doesn't work. Idk why)

        webSocketSessions[nextSessionId] = new Client(/*name*/null, nextSessionId); // No names for now
        webSocketSessions[nextSessionId].webSocketConnection = ws;
        console.log(nextSessionId);
        console.log(ws);

        let test = 10001;

        console.log("Client Connected");
        ws.send(JSON.stringify({ "eventType": "Connection Ready" }));

        ws.on('message', async function message(data) {

                let body = "";
                try
                {
                    body = JSON.parse(String.fromCharCode(...data));
                }
                catch (e)
                {
                    console.log("Failed to parse data json");
                    return;
                }

                try
                {
                    switch (body["eventType"]) {
                        case "message":

                            [result, undef] = await connection.execute("INSERT INTO Message SET message = ?, roomId = ?, replyMessageId = ?", [body["event"]["message"], body["event"]["roomId"], body["event"]["replyTo"] ?? null]);
                            
                            // This is needed for tests, useful anyway
                            ws.send(JSON.stringify(new messageEvents.MessageAcknowledgement(body["event"]["message"], body["event"]["roomId"])));

                            notifyClientsOfNewMessage(ws, result.insertId, false, body["event"]["message"], body["event"]["replyTo"]);

                            break;
                        case "getMessages":
                            console.log("Getting Messages from room", body["event"]["roomId"]);
                            [rows, columns] = await connection.query(
                                'SELECT messageId, replyMessageId, roomId, message, (questionId IS NOT NULL) AS isQuestion, Title, answerStatus, answerMessageID FROM `Message` LEFT JOIN `Questions` ON `Questions`.questionId = `Message`.messageId WHERE `roomId` = ' + body["event"]["roomId"], // Only Loads messages for now for easy test/'mvp'  
                            )

                            let getAllMessagesResponse = new messageEvents.GetAllMessagesResponse(rows);
                            ws.send(JSON.stringify(getAllMessagesResponse));

                            break;
                        case "markAnswerQuestion":
                            // constraint for it being a reply for this id maybe?
                            await connection.execute("UPDATE Questions SET answerStatus = 1, answerMessageID = ? WHERE questionId = ?", [body["event"]["answerMessageId"], body["event"]["questionId"]]);

                            let markAnswerQuestionResponse = new messageEvents.MarkQuestionAnswerResponse(body["event"]["questionId"], body["event"]["answerMessageId"]);

                            let jsonResponse = JSON.stringify(markAnswerQuestionResponse);
                            for ([sessionID, client] of Object.entries(webSocketSessions)) {
                                client.webSocketConnection.send(jsonResponse);
                            }

                            break;
                        case "createQuestion":
                            // this could be a transaction?
                            
                            [result, undef]= await connection.execute("INSERT INTO Message SET message = ?, roomId = ?", [body["event"]["message"], body["event"]["roomId"]]);
                            await connection.execute("INSERT INTO Questions SET title = ?, questionId = ?", [body["event"]["title"], result.insertId]);

                            ws.send(JSON.stringify(new messageEvents.QuestionAcknowledgement(body["event"]["message"], body["event"]["roomId"])));
                            notifyClientsOfNewMessage(ws, result.insertId, true, body["event"]["message"], body["event"]["replyTo"]);

                            break;
                        case "getAllRooms":
                            [rows, columns] = await connection.query('SELECT * FROM `Room`');
                            let roomsResponse = new messageEvents.GetAllRoomsResponse(rows);
                            console.log(roomsResponse);
                            ws.send(JSON.stringify(roomsResponse));
                            break;
                        case "createQuestion":
                            connection.execute("INSERT INTO Questions SET ")
                        default:
                            throw new Exception("test");
                    }
                } catch(e) {
                    console.log(e);
                    return;
                }

                let event = body["event"];

                console.log('received: %s', data);
                console.log('received: %s', test);
        });
    });
}

let resolveInitializePromise;
hasInitialised = new Promise((resolve, reject) => resolveInitializePromise = resolve);

initialize = async () =>
{
    try
    {
        connection = await mysql.createConnection({ // Put actual details for db into here
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            multipleStatements: true,
            ssl: {
                ca: fs.readFileSync("ca.pem")
            }
        });
    } catch (e) {
        console.log(e);
        return;
    }

    module.exports["databaseConnection"] = connection;
    console.log("Connected to database, starting websocket server");
    startWebSocketServer();
    resolveInitializePromise();
}

module.exports = { "webSocketServer": webSocketServer, "initializedPromise": hasInitialised };

// zach said this didn't work for him?
initialize();