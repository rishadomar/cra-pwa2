import React from 'react';
import './App.css';

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

// function for creating the notification
function handleOnSendNotification(msg) {
    // Create and show the notification
    if ('serviceWorker' in navigator) {
        console.log("Yay we have seviceWorker in nav")
        navigator.serviceWorker.ready
            .then(swreg => {
                console.log('ready to show a notification')
                swreg.showNotification("title here", { body: "Some cool info here" })
            })
            .catch(e => console.log("SW error when waiting to be ready", e))
    }
    //    new Notification('Title here', { body: text, icon: img });
}


function App() {
    return (
        <div className="App">
            <h1>Hello</h1>
            <button disabled={Notification.permission === 'granted' || Notification.permission === 'denied'} onClick={() => handleOnClickEnablePushNotifications()}>Allow Push Notifications</button>
            <button disabled={Notification.permission !== 'granted'} onClick={() => handleOnSendNotification("Hello World!")}>Push a Notification</button>
            <button disabled={Notification.permission !== 'denied'}>Eish! It seems like you have denied receiving notifications. See here for how to undo this.</button>
        </div>
    );
}

export default App;
