import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

const APP_CLIENT_ID = process.env.APP_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const AUTH_URL = `https://auth.monday.com/oauth2/authorize?client_id=${APP_CLIENT_ID}`;
const ACCESS_TOKEN_ENDPOINT = 'https://auth.monday.com/oauth2/token';
const MONDAY_API_ENDPOINT = 'https://api.monday.com/v2';

export default function Home() {

    const [boards, setBoards] = useState([]);
    const [accountConnected, setAccountConnected] = useState(false);

    const fetchBoardData = (access_token) => {
        if(!access_token) return console.log("Authorize app first!");
        fetch(MONDAY_API_ENDPOINT, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : access_token
            },
            body: JSON.stringify({
                'query' : '{ boards (limit:5) {id name groups{ id title} } }'
            })
        })
        .then(async(res) => {
            const data = await res.json();
            console.log("API RES==>",data.data.boards);
            setAccountConnected(true);
            setBoards(data.data.boards); 
        }).catch(err => console.log("API ERR:", err));
    }

    const saveAccessToken = (access_token) => {
        chrome.storage.local.set({"monday_access_token": access_token}, function() {
            console.log('Value is set to ' + access_token);
          });
    };

    const getTokenAndFetchBoads = async () => {
        chrome.storage.local.get(['monday_access_token'], function(result) {
            if(result.monday_access_token) setAccountConnected(true);
            fetchBoardData(result.monday_access_token);
            return result.monday_access_token;
          });
    };

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
                saveAccessToken(d.access_token);
                return fetchBoardData(d.access_token)
              }).catch(err => console.log("Err==>",err))
        });
    }

    useEffect(() => {
        getTokenAndFetchBoads();
    },[]);

    const handleDisconnectClick = () => {
        chrome.storage.local.clear();
        setAccountConnected(false);
    };

    const handleCreateItem = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const itemName = form.get('name');
        const boardId = form.get('boardId');
        return saveBoardItem({boardId, itemName}, e)
    }

    const getAccessToken = async() => {
        const {monday_access_token} = await chrome.storage.local.get(['monday_access_token']);
        if(!monday_access_token) console.log("No access token");
        return monday_access_token;
    }

    const saveBoardItem = async(payload, e) => {
        const access_token = await getAccessToken();
        let query = `mutation { create_item (board_id: ${payload.boardId}, group_id: \"topics\", item_name: \"${payload.itemName}\") { id }}`;

            fetch (MONDAY_API_ENDPOINT, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : access_token
            },
            body: JSON.stringify({
                query : query
            })
            })
        .then(res => {
            res.json();
            alert("Item created successfully!");
            e.target.reset();
        })
        .then(res => console.log(JSON.stringify(res, null, 2)));
    }

    return (
        <div>
            {/* <h1>I am test extension!</h1> */}
            {/* <div>
                <img src={RenderingImg} alt="Render Arch" />
            </div> */}
            {accountConnected ? <div> <p>Account Connected!</p> <button onClick={handleDisconnectClick}>Disconnect Account</button></div> : <button onClick={handleConnectMonday}>Connect to Monday</button>}

            <div style={{margin: 5}}><Link to="/test">Test router link</Link></div>
            <hr />
            <div>
                <h4>Connected board list:</h4>
                {accountConnected && boards.length > 0 ? boards.map((b) => {
                    return <p key={b.id}>&#9734; Name: <strong>{b.name}</strong>, ID: <strong>{b.id}</strong></p>
                }) : 'No boards to display!'}
            </div>

            <form onSubmit={handleCreateItem}>
                <input type="text" name="name" placeholder='Enter item name' required />
                <input type="text" name="boardId" placeholder='Enter board ID' required />
                <button type='submit'>Create Item</button>
            </form>
        </div>
    )
}

// root.render(<Popup />)