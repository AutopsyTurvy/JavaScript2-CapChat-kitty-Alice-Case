

// src/script/index.mjs

// location.pathname for forms ===
// '/index.html'
// '/profile/login/login.html'

import { setRegisterFormListener } from "./handlers/register.mjs";
import { setLoginFormListener } from "./handlers/login.mjs";


const path = location.pathname;

if (path === '/profile/login/login.html') {
    setLoginFormListener()
} else if (path === '/index.html') {
    setRegisterFormListener()
}



