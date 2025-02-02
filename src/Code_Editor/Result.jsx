import React from 'react'
import { Box, styled } from '@mui/material'
import { useContext,useEffect,useState } from 'react'

import {EditorContext} from '../components/PracticeJS';

function Result() {

    const[src, setSrc] = useState('');
    const{ html,css,js}=useContext(EditorContext);

    const srcCode=`
        <html>
            <body>${html}</body>
            <style>${css}</style>
            <script>${js}</script>
        </html>

    `
    useEffect(()=>{
        const timeOut = setTimeout(()=>{
            setSrc(srcCode);
        },1000)
        return ()=> clearTimeout(timeOut);
    },[html,css,js])

  return (
    <Box className="flex-1">
        <iframe
            srcDoc={src}
            title='Output'
            // sandbox='allow-scripts'
            width='100%'
            height='100%'
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        />
    </Box>
  )
}

export default Result
