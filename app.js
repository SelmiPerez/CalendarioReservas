const CLIENT_ID = '519684562102-k2qrrtkj9u6qbr96igvrhq66n6sn68l1.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDz0Ln5abh9jSXAA3nJVvm3LF_4X167BZE';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');
let content = document.getElementById('content');
let form = document.getElementById('reservation_form');
let output = document.getElementById('output');

// Cargar la API de Google
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Crear reserva en Google Calendar
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let userName = document.getElementById('user_name').value;
    let date = document.getElementById('reservation_date').value;
    let startTime = document.getElementById('start_time').value;
    let endTime = document.getElementById('end_time').value;

    let event = {
        'summary': `Reserva de ${userName}`,
        'start': {
            'dateTime': `${date}T${startTime}:00`,
            'timeZone': 'Europe/Madrid',
        },
        'end': {
            'dateTime': `${date}T${endTime}:00`,
            'timeZone': 'Europe/Madrid',
        },
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 10 },
                { 'method': 'popup', 'minutes': 10 }
            ],
        },
    };

    gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event,
    }).then((response) => {
        output.innerText = 'Reserva creada con éxito';
    }).catch((error) => {
        output.innerText = 'Error creando la reserva';
    });
});
