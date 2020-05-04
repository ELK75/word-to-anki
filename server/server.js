const express = require('express')
var cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors());

require('es6-promise').polyfill();
require('isomorphic-fetch');


let port = 9000;



const { Translate } = require('@google-cloud/translate').v2;

// Instantiates a client
const translate = new Translate({ projectId: "cs1520-267115" });

async function getTranslation(text) {
    // The target language
    const target = 'en';

    // Translates some text into Russian
    const [translation] = await translate.translate(text, target);
    return translation;
}

app.get('/translate/:text', async function (req, res) {
    try {
        let text = req.params.text;
        const result = await getTranslation(text);
        res.send({ result });
    } catch (e) {
        console.log(e);
        res.send({ "error": "some translation error" });
    }
});

function invoke(action, version, params = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify({ action, version, params }));
    });
}

function constructCall(front, back) {
    return (
        {
            "action": "addNote",
            "version": 6,
            "params": {
                "note": {
                    "deckName": "SpanishVocab",
                    "modelName": "Basic",
                    "fields": {
                        "Front": front,
                        "Back": back
                    },
                    "options": {
                        "allowDuplicate": false,
                        "duplicateScope": "deck"
                    }
                }
            }
        });
}

app.post('/add/:front/:back', async function (req, res) {
    try {
        let { front, back } = req.params;
        let postData = constructCall(front, back);
        console.log(postData);
        await fetch('http://localhost:8765/createNote', {
            method: "POST",
            body: JSON.stringify(postData)
        })
        res.send({"message": "success"});
    } catch (e) {
        console.log(e);
        res.send({ "error": "some translation error" });
    }
})

console.log(`Listening on Port ${port}`);
app.listen(port);