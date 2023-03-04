//var assert = require('assert');
var webSocketServer = require("../webSocketServer.js");
const WebSocket = require('ws');
var fs = require("fs")
var assert = require('assert');

var messageEvents = require("../html/MessageEvents.js");

before(async function ()
{
  console.log("initializing");
  await webSocketServer.initializedPromise;
  user1 = new WebSocket("ws://localhost:8000");
  user2 = new WebSocket("ws://localhost:8000");

  //await webSocketServer.initialize();
  let fileData = fs.readFileSync("test/database.sql").toString();
  try
  {
    result = await webSocketServer.databaseConnection.query(fileData);
  } catch (e) {
    console.log(e);
    if (e != undefined)
      throw e;
  }

})

// Create tests for execution later
describe('ServerSide', function () {
  // HACK await 2 seconds for the websocket to connect
  //await new Promise(r => setTimeout(r, 2000));

  //console.log("promise completed");

  describe('webSockets', function () {
    it('should not respond when client sends invalid string', function (done) {
      // ARRANGE
      let hasReceivedMessage = false;
      let hasTimedOut = false; // HACK to prevent .once from calling when we move to the next test
      user1.once("message", (message) => {
        if (hasTimedOut)
          return;

        console.log("message received");
        hasReceivedMessage = true;
        done("recieved a message, which we shouldn't have");
      });

      // ACT
      user1.send("{hello}");

      // ASSERT
      new Promise(r => setTimeout(r, 1000)).then(() =>
      {
        if (!hasReceivedMessage)
        {
          hasReceivedMessage = false;
          hasTimedOut = true;
          done();
        }
      })
    });

    // Message event
    describe("event: message", function() {
      it('should send message to other clients, recieve ack', function (done) {
        // ASSERT (mocha will timeout if not received)
        let hasReceivedMessage = false;

        user2.once("message", (message) => {
          // The server should respond with a newMessage event
          let response = JSON.parse(message);

          assert.equal("newMessage", response["eventType"]);
          assert.equal("This is a certified unit test message", response["event"]["message"]);

          hasReceivedMessage = true;
          done();
        });
  
        // ACT
        console.log("sending");
        user1.send(JSON.stringify(new messageEvents.CreateNewMessageEvent("This is a certified unit test message", 0)));
      });

      // Tests if messages get stored inside of the database
      it('should store messages in the database', function (done) {
        // ARRANGE the assert, we await for the server to respond about the message
        user1.once("message", async (message) =>
        {
          let response = JSON.parse(message);

          if (response["eventType"] != "messageAcknowledgement")
          {
            done("Invalid event type, expected message ack");
            return;
          }

          try
          {
            let [rows, columns] = await webSocketServer.databaseConnection.query("SELECT COUNT(*) FROM Message WHERE message = \"TEST_MESSAGE\"; ");
            assert.equal(1, rows[0]["COUNT(*)"]);
            done();
          }
          catch (e)
          {
            console.error(e);
            throw e;
          }
        })

        // ACT
        user1.send(JSON.stringify(new messageEvents.CreateNewMessageEvent("TEST_MESSAGE", 0)));
      });
    })
    
    // Tests if messages get stored inside of the database
    it('should store messages as a reply in the database', function (done) {
      // ARRANGE the assert, we await for the server to respond about the message
      user1.once("message", async (message) =>
      {
        let response = JSON.parse(message);

        if (response["eventType"] != "messageAcknowledgement")
        {
          done("Invalid event type, expected message ack");
          return;
        }

        try
        {
          [rows, columns] = await webSocketServer.databaseConnection.query("SELECT COUNT(*) FROM Message WHERE message = \"REPLY_TEST_MESSAGE\" AND replyMessageId = -1; ");
          assert.equal(1, rows[0]["COUNT(*)"]);
          done();
        } catch (e) {
          console.error(err);
          throw err;
        }
      })

      // ACT
      user1.send(JSON.stringify(new messageEvents.CreateNewMessageEvent("REPLY_TEST_MESSAGE", 0, -1)));
    });

    it('should respond with all the rooms', function (done) {
      let user = new WebSocket("ws://localhost:8000");
      // ARRANGE the assert, we await for the server to respond about the message
      user.onopen = () => 
      {
        user.addEventListener("message", (message) =>
        {
          let response = JSON.parse(message.data);

          if (response["eventType"] != "getAllRooms")
          {
            if (response["eventType"] == "Connection Ready")
              return;

            done("incorrect event returned");
            return;
          }
          
          // Assert
          if (response["event"].length != 2)
          {
            done("Invalid size returned");
            return;
          }

          if (response["event"][0].roomName == "Lecture 1" && response["event"][1].roomName == "Lecture 2")
          {
            done();
            user.close();
          }
          else
            done("Failed to get correct data");
          
          //if (response["eventType"])
        });

        // ACT
        user.send(JSON.stringify(new messageEvents.RequestAllRoomsEvent()));
      }
    });

    it('should show questions and messages in getMessages', function (done) {
      let user = new WebSocket("ws://localhost:8000");
      // ARRANGE the assert, we await for the server to respond about the message
      user.onopen = () => 
      {
        user.addEventListener("message", (message) =>
        {
          let response = JSON.parse(message.data);

          if (response["eventType"] != "Loaded Messages")
            return;
          
          // Assert, I wish we had LINQ for the ids :(
          // empty question
          assert.equal(response.event[3].isQuestion, 1);
          assert.equal(response.event[3].message, "question");
          assert.equal(response.event[3].Title, "questionTitle");
          assert.equal(response.event[3].answerStatus, 0);

          // answered question
          // id -3 
          assert.equal(response.event[2].isQuestion, 1);
          assert.equal(response.event[2].message, "AnotherQuestion");
          assert.equal(response.event[2].Title, "AnotherQuestionTitle");
          assert.equal(response.event[2].answerStatus, 1);
          assert.equal(response.event[2].answerMessageID, -4);

          // normal message
          // id -4
          assert.equal(response.event[4].isQuestion, 0);
          assert.equal(response.event[4].message, "hi");
          assert.equal(response.event[4].Title, null);
          assert.equal(response.event[4].answerStatus, null);
          assert.equal(response.event[4].answerMessageID, null);

          done();
          //if (response["eventType"])
        });

        // ACT
        user.send(JSON.stringify(new messageEvents.RequestAllMessages(0)));
      }
    });

    it('should update database on question update', function (done) {
      // ARRANGE the assert, we await for the server to respond about the message
      user1.once("message", async (message) =>
      {
        let response = JSON.parse(message);

        if (response["eventType"] != "markAnswerQuestion")
        {
          done("Invalid event type, expected message ack");
          return;
        }

        try
        {
          [rows, columns] = await webSocketServer.databaseConnection.query("SELECT COUNT(*) FROM Questions WHERE questionId = -5 AND answerMessageId = -1; ");
          assert.equal(1, rows[0]["COUNT(*)"]);
          done();
        } catch (e) {
          console.error(err);
          throw err;
        }
      })

      // ACT
      user1.send(JSON.stringify(new messageEvents.MarkQuestionAnswerEvent(-5, -1)));
    });

    it('should create question', function (done) {
      // ARRANGE the assert, we await for the server to respond about the message
      user1.once("message", async (message) =>
      {
        let response = JSON.parse(message);

        if (response["eventType"] != "questionAcknowledgement")
        {
          done("Invalid event type, expected question ack");
          return;
        }

        try
        {
          [rows, columns] = await webSocketServer.databaseConnection.query("SELECT COUNT(*) FROM Questions WHERE Title = 'titleunittest'");
          assert.equal(1, rows[0]["COUNT(*)"]);
          done();
        } catch (e) {
          console.error(err);
          throw err;
        }
      })

      // ACT
      user1.send(JSON.stringify(new messageEvents.CreateNewQuestionEvent("titleunittest", "message", 0)));
    });
  });
});