const express = require('express');

const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: '4YksG3/7Z5mViRqTP5LzIeoJsMvRhRZ7iHXftPbkIUZkU2pMgKrRnwP8wzzxydicRPGIeDizHuqHpS0SBsWu9iESeOWk1QnMnC25DTn58LpYbeP/m5oe0VEEdtr05lWP00BkfR8r5h7YW3PMqWPG4AdB04t89/1O/w1cDnyilFU=',
    channelSecret: '806fa7f88f5c4b596cada8448d9fd2c5'
};
const client = new line.Client(config);
//FIREBASE
const firebase = require('firebase');
require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyDH5B6wSM_KJOVCwzDy2UCb4UrIDNIn63A",
    authDomain: "lineoa-8fe3a.firebaseapp.com",
    projectId: "lineoa-8fe3a",
    storageBucket: "lineoa-8fe3a.appspot.com",
    messagingSenderId: "700168483037",
    appId: "1:700168483037:web:872ce4f013d5c583ddab34"
} 
const admin = firebase.initializeApp(firebaseConfig);
const db = admin.firestore();
//wer
const app = express();
const port = 3000

app.post('/webhook', line.middleware(config), (req, res) => {
    //console.log(req);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
     // SAVE TO FIREBASE
     let chat = await db.collection('chats').add(event);
     console.log('Added document with ID: ', chat.id);

     
    //console.log(event);
    //console.log(event.message);
    //console.log(event.message.text);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });
}


// Respond with Hello World! on the homepage:
app.get('/', function (req, res) {
    res.send('Hello World55555!')
})

app.get('/test-firebase', async function (req, res) {
    let data = {
        name: 'Tokyo',
        country: 'Japan'
    }
    const result = await db.collection('cities').add(data);
    console.log('Added document with ID: ', result.id);
    res.send('Test firebase successfully, check your firestore for a new record !!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.post('/', function (req, res) {
    res.send('Got a POST request')
})
// Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})
// Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})
