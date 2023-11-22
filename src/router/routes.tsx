import { lazy } from 'react';

const MsgSetting = lazy(() => import('../pages/msgSetting'));


const routes = [
    // dashboard
    {
        path: '/',
        element: <MsgSetting />,
    },
    {
        path: '/test',
        element: <MsgSetting />
    },

    
    
];

export { routes };
