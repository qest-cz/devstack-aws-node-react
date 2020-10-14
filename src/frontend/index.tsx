import React from 'react'
import ReactDOM from 'react-dom'

declare const Conf: any

console.log(Conf)

ReactDOM.render(
    <React.StrictMode>
        <h1>Hello World</h1>
    </React.StrictMode>,
    document.getElementById('root'),
)
