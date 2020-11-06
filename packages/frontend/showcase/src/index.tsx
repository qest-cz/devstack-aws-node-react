import React from 'react'
import ReactDOM from 'react-dom'
import { TESTING_STRING } from 'co-utils'

ReactDOM.render(
    <React.StrictMode>
        <h1>Hello World {TESTING_STRING}</h1>
    </React.StrictMode>,
    document.getElementById('root'),
)
