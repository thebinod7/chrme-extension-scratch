import React from 'react';
import { createRoot } from "react-dom/client";

import './App.scss';
import RenderingImg from './images/rendering.png';

const root = createRoot(document.getElementById("root"));

function Popup(){
    return (
        <div>
            <h1>I am default popup!</h1>
            <div>
                <img src={RenderingImg} alt="Render Arch" />
            </div>
        </div>
    )
}

root.render(<Popup />)