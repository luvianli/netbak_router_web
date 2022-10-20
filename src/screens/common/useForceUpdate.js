import { useState, useEffect } from 'react';

export default function useForceUpdate(){
    const [_, setNew] = useState(0);
    return ()=> setNew(Date.now());
}
