import React, { createContext,useState } from "react"; 
import { UserContext } from "./UserContext";
export const UserState=(props) => { 
    const [state, setState] = useState({
        user: null,
        token: null,
    });
    
    return (
        <UserContext.Provider value={{ state, setState }}>
        {props.children}
        </UserContext.Provider>
    );
}