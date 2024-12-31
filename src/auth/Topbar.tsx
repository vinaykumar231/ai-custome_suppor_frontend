import { useLogin } from './LoginContext';

const Topbar = () => {
    const { logout }: any = useLogin();
    const userData: any = JSON.parse(localStorage.getItem("user") || '{}');
    console.log(userData.user_name);

    const handleLogOut = () => {
        logout();

    };

    return (
        <div className="bg-gray-800 text-white py-3 px-6 flex items-center justify-between">
            {/* Left Section: Company Name */}
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">{userData.user_name} - {userData.user_type} </h1>
            </div>

            {/* Center Section: User Info in Select Dropdown */}
            <div className="flex items-center space-x-4">
                <select className="bg-gray-700 text-white px-4 py-2 rounded-md">

                    <option >{userData.company_name} </option>
                    <option >{userData.user_email}</option>
                     
                </select>
            </div>

            {/* Right Section: Logout Button */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleLogOut}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 "
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Topbar;
