import React from 'react';
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

function Popup(){
    return (
        <div>
            <h1>I am default popup!</h1>
        </div>
    )
}

root.render(<Popup />)