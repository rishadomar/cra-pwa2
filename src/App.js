import React from 'react';
import './App.css';
import { urlBase64ToUint8Array } from "./utilities"

// askNotificationPermission function to ask for permission when the "Enable notifications" button is clicked
function handleOnClickEnablePushNotifications() {

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
    } else {
        Notification.requestPermission()
            .then((permission) => {
                console.log("Yay permission request coming back as: ", permission)
            })
            .catch(e => {
                console.log("Error encountered requesting permission: ", e)
            })
    }
}

function handleOnSendNotification() {
    if (!('serviceWorker' in navigator)) {
        console.log('Eeek no sw in nav')
        return
    }

    console.log('configure push subscription')
    let registration
    navigator.serviceWorker.ready
        .then(swreg => {
            console.log('swreg is ready')
            registration = swreg
            return registration.pushManager.getSubscription();
        })
        .then(sub => {
            if (sub === null) {
                let vapidPublicKey = 'BBnMoobIlOL2aPkivgyNQUTNvPuiG1qdLnz2goulCX43RY0V-VGzq5kzHNH6Y35yVnjmTi4GrxUeeSQCUxF2A4Q';
                let convertedPublicKey = urlBase64ToUint8Array(vapidPublicKey)
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedPublicKey
                })
            } else {
                // we have a sub
                console.log('already have a sub:', JSON.stringify(sub))
                return sub
                //                throw new Error('Already have a sub')
            }

        })
        .then(newSubscription => {
            console.log('newsub:', JSON.stringify(newSubscription))
            postNotificationSubscription(newSubscription)
        })
        .catch(err => {
            console.log("Error in subscription: ", err)
        })
}

// function EVENTUALLY_USE_subscribeToNotifications() {
//     postNotificationSubscription({
//         "endpoint": "https://fcm.googleapis.com/fcm/send/cN_6wqpRhCI:APA91bHTRi0bsoi1t_B-58jAbRpEyF5H-NpK3GVm4Jief1K_Fmehas6rDm257UTwWxsa3MSXDZUuVcqVUBZi9ddbkZdln4S5nqZq8yOYAVkrobGHbZyQDYoe3zjyqeWRxpHQVWGQsHjc",
//         "expirationTime": null,
//         "keys": {
//             "p256dh": "BAnLYv3MShei_6VNxL2X-qq9tOOmyPaA8dKc2cz2mjU_SnOiw8mtor5C6bIUwoHLYgwZTJicfX6embQviQpN75I",
//             "auth": "WCpC0c7WiPiPnfhHug_-XQ"
//         },
//         "device": "browser/mobile/tablet",
//         "user": "ismail-aux-co-za"
//     })
// }

function postNotificationSubscription(subscription) {
    fetch('https://2a64bafaa900.ngrok.io/subscription', {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
        .then(res => {
            if (res.ok) {
                console.log("Result from post succesful", res)
            } else {
                console.log("Result from post failed", res)
            }
        })
        .catch(err => {
            console.log("Error in subscription: ", err)
        })
}

function App() {
    return (
        <div className="App">
            <h1>Hello</h1>
            <button disabled={Notification.permission === 'granted' || Notification.permission === 'denied'} onClick={() => handleOnClickEnablePushNotifications()}>Allow Push Notifications</button>
            <button disabled={Notification.permission !== 'granted'} onClick={() => handleOnSendNotification("Hello World!")}>Push a Notification</button>
            <button disabled={Notification.permission !== 'denied'}>Eish! It seems like you have denied receiving notifications. See here for how to undo this.</button>
            <button onClick={() => handleOnSendNotification()}>Try Post</button>
        </div>
    );
}

export default App;
