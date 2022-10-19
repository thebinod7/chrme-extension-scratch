import React, { useState } from 'react';
import { createRoot } from "react-dom/client";

import './App.scss';
const root = createRoot(document.getElementById("root"));

// import RenderingImg from './images/rendering.png';
const APP_CLIENT_ID = process.env.APP_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const AUTH_URL = `https://auth.monday.com/oauth2/authorize?client_id=${APP_CLIENT_ID}`;
const ACCESS_TOKEN_ENDPOINT = 'https://auth.monday.com/oauth2/token';
const MONDAY_API_ENDPOINT = 'https://api.monday.com/v2';

function Popup() {

    const [boards, setBoards] = useState([]);
    const [accountConnected, setAccountConnected] = useState(false);

    const fetchBoardData = (access_token) => {
        fetch(MONDAY_API_ENDPOINT, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : access_token
            },
            body: JSON.stringify({
                'query' : '{ boards (limit:1) {id name} }'
            })
        })
        .then(async(res) => {
            const data = await res.json();
            console.log("API RES==>",data.data.boards);
            setBoards(data.data.boards); 
        }).catch(err => console.log("API ERR:", err));
    }

    const handleConnectMonday = () => {
        chrome.identity.launchWebAuthFlow({'url':AUTH_URL,'interactive':true}, function(redirect_url){
            const queryParameters = redirect_url.split("?")[1];
            const urlSearchParams = new URLSearchParams(queryParameters);
            const code = urlSearchParams.get('code');
            // Get access_token using code
            const data = {
                code: code,
                client_id: APP_CLIENT_ID,
                client_secret: CLIENT_SECRET
            }
            fetch(ACCESS_TOKEN_ENDPOINT, {
                method:'post',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(data)
              }).then(async(res) => {
                const d = await res.json();
                setAccountConnected(true);
                return fetchBoardData(d.access_token)
              }).catch(err => console.log("Err==>",err))
      
            // Fetch boards using API
        });
    }

    return (
        <div>
            {/* <h1>I am test extension!</h1> */}
            {/* <div>
                <img src={RenderingImg} alt="Render Arch" />
            </div> */}
            {accountConnected ? <p>Account Connected!</p> : <button onClick={handleConnectMonday}>Connect to Monday</button>}

            <hr />
            <div>
                <h4>Connected board list:</h4>
                {boards.length > 0 ? boards.map((b) => {
                    return <p key={b.id}>&#9734; Name: <strong>{b.name}</strong>, ID: <strong>{b.id}</strong></p>
                }) : 'No boards to display!'}
            </div>
        </div>
    )
}

root.render(<Popup />)