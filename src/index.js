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
    console.log('[Request] GET /healthcheck', {
        timestamp: new Date().toISOString(),
        headers: req.headers
    })
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
    const response = {
        timeStamp,
        status: statusCode,
        ...body
    }
    
    console.log('[Response]', {
        timestamp: new Date(timeStamp).toISOString(),
        statusCode,
        body: response
    })
    
    res.status(statusCode).send(response)
}

app.post("/", async (req, res) => {
    console.log('[Request] POST /', {
        timestamp: new Date().toISOString(),
        body: req.body,
        headers: req.headers
    })
    
    try {
        const output = await runCode(req.body)
        sendResponse(res, 200, output)
    } catch (err) {
        console.error('[Error] POST /', {
            timestamp: new Date().toISOString(),
            error: err,
            request: req.body
        })
        sendResponse(res, err?.status || 500, err)
    }
})

app.get('/list', async (req, res) => {
    console.log('[Request] GET /list', {
        timestamp: new Date().toISOString(),
        headers: req.headers
    })
    
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
