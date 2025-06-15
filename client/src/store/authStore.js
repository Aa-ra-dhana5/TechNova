import {create} from 'zustand';

export const useauthStore =create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,

    login: (userData) =>{
        localStorage.setItem("user", JSON.stringify(userData));
        setItem({user: userData});
    },

    logout: () =>{
        localStorage.removeItem("user");
        setItem({user: null});
    }
    
}))