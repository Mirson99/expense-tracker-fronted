import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {    
    const { user, login, logout } = useAuth();
    let navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (<>
        <div className="bg-gray-800 flex w-full max-w-full items-center justify-between">
            <div>
                <p className="text-2xl p-4 font-semibold text-gray-100">Expense Tracker</p>
            </div>         
            <div className="flex">
                <p className="text-1xl p-4 font-semibold text-gray-100">{user?.email}</p>
                <button onClick={handleLogout} className="text-1xl p-4 font-semibold text-rose-500 hover:cursor-pointer">logout</button>
            </div>            
        </div>
    </>);
}