import React from "react";

function wrapper( { children }) {
    const style = {
        border : '2px solid black',
        padding : '16px',
    };
    return <div style={style}>{ children } </div>;
}

export default wrapper;