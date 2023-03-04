const express = require('express')

require("./htmlServer.js");
const WebSocketServer = require("./webSocketServer.js")

const app = express()
app.use(express.json()) 

app.get('/login', function (req, res) {

    // TODO validation on this, make sure that it exists
    // or return an error
    let name = req.body["name"];
    let roomId = req.body["roomId"];
    let password = req.body["password"];
    
    
    res.statusCode = 200;
    //res.json(nextSessionId);

    
})

app.listen(3000)