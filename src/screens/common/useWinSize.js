import { useState, useEffect } from 'react';

export default function useWinSize(){
    const [width, setWidth] = useState(document.documentElement.clientWidth);
    const [height, setHeight] = useState(document.documentElement.scrollHeight);

    const onResize = () =>{
        setWidth(document.documentElement.clientWidth);
        setHeight(document.documentElement.scrollHeight);
    };
    useEffect(() => {
        window.addEventListener('resize', onResize, false);

        return () => {
            window.removeEventListener('resize', onResize, false);
        };
    },[]);

    return {width, height};
}
