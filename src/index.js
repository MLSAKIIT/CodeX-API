const {runCode} = require("./run-code");
const {supportedLanguages} = require("./run-code/instructions");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const {info} = require("./run-code/info");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!AUTH_TOKEN) {
    console.error('AUTH_TOKEN environment variable is not set');
    process.exit(1);
}

app.get('/healthcheck', (req, res) => {
    sendResponse(res, 200, { status: 'healthy' });
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || authHeader !== AUTH_TOKEN) {
        return sendResponse(res, 401, { error: 'Unauthorized' });
    }
    
    next();
};

app.use(authMiddleware);

const sendResponse = (res, statusCode, body) => {
    const timeStamp = Date.now()

    res.status(statusCode).send({
        timeStamp,
        status: statusCode,
        ...body
    })
}

app.post("/", async (req, res) => {
    try {
        const output = await runCode(req.body)
        sendResponse(res, 200, output)
    } catch (err) {
        sendResponse(res, err?.status || 500, err)
    }
})

app.get('/list', async (req, res) => {
    const body = []

    for(const language of supportedLanguages) {
        body.push({
            language,
            info: await info(language),
        })
    }

    sendResponse(res, 200, {supportedLanguages: body})
})

app.listen(port);
