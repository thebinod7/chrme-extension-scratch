import React from 'react';
import { createRoot } from "react-dom/client";

import './App.scss';
// import RenderingImg from './images/rendering.png';
const APP_CLIENT_ID = process.env.APP_CLIENT_ID;

const root = createRoot(document.getElementById("root"));
const REDIRECT_URL = `https://auth.monday.com/oauth2/authorize?client_id=${APP_CLIENT_ID}`;

function Popup(){

    return (
        <div>
            <h1>I am default popup!</h1>
            {/* <div>
                <img src={RenderingImg} alt="Render Arch" />
            </div> */}
            <a href={REDIRECT_URL}>Connect to Monday</a>
        </div>
    )
}

root.render(<Popup />)