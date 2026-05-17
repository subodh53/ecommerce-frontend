import { createContext, useState } from "react"

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(localStorage.getItem("currentUserEmail") ? { email: localStorage.getItem("currentUserEmail") } : null);

    function SignUp(email, password) {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if(users.find((u) => u.email === email)) {
                return { success: false, error: "Email already exists" }
            }
            const newUser = { email, password };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUserEmail", email);
            setUser({ email });
            return { success: true }
        } catch (error) {
            console.error('Error in SignUp:', error);
            return { success: false, error: "An error occurred during sign up" }
        }
    }

    function LogIn(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find((u) => u.email === email && u.password === password);
        if(!user){
            return { success: false, error: "Invalid email or password" }
        }
        localStorage.setItem("currentUserEmail", email);
        setUser({ email });
        return { success: true }
    }

    function logout() {
        localStorage.removeItem("currentUserEmail");
        setUser(null);
    }
    return <AuthContext.Provider value={{ SignUp, user, logout, LogIn }}>{children}</AuthContext.Provider>
}