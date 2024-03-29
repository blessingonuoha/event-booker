import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
 var gapi = window.gapi;
 console.log(gapi);
 //  console.log(process.env.API_KEY);
 /* 
    Update with your own Client Id and Api key 
  */
 var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
 ];
 var SCOPES = "https://www.googleapis.com/auth/calendar.events";

 const handleClick = () => {
  gapi.load("client:auth2", () => {
   console.log("loaded client");

   gapi.client.init({
    apiKey: process.env.REACT_APP_API_KEY,
    clientId: process.env.REACT_APP_CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    plugin_name: "calendar",
   });

   gapi.client.load("calendar", "v3", () => console.log("bam!"));

   gapi.auth2
    .getAuthInstance()
    .signIn({
     scope: "https://www.googleapis.com/auth/calendar",
     prompt: "consent",
    })
    .then(() => {
     var event = {
      summary: "Awesome Event!",
      location: "800 Howard St., San Francisco, CA 94103",
      description: "Really great refreshments",
      start: {
       dateTime: "2024-02-19T09:00:00-07:00",
       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
       dateTime: "2024-02-19T17:00:00-07:00",
       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recurrence: [],
      attendees: [],
      reminders: {
       useDefault: false,
       overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
       ],
      },
     };

     var request = gapi?.client?.calendar?.events?.insert({
      calendarId: "primary",
      resource: event,
     });

     request.execute((event) => {
      console.log(event);
      // window.open(event.htmlLink);
     });

     /*
            Uncomment the following block to get events
        */

     // get events
     gapi.client.calendar.events
      .list({
       calendarId: "primary",
       timeMin: new Date().toISOString(),
       showDeleted: false,
       singleEvents: true,
       maxResults: 10,
       orderBy: "startTime",
      })
      .then((response) => {
       const events = response.result.items;
       console.log("EVENTS: ", events);
      });
    });
  });
 };

 return (
  <div className="App">
   <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>Click to add event to Google Calendar</p>
    <p style={{ fontSize: 18 }}>Uncomment the get events code to get events</p>
    <p style={{ fontSize: 18 }}>
     Don't forget to add your Client Id and Api key
    </p>
    <button style={{ width: 100, height: 50 }} onClick={handleClick}>
     Add Event
    </button>
   </header>
  </div>
 );
}

export default App;
