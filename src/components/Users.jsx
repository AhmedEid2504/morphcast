import { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [sessionDurations, setSessionDurations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('contains');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(30);
    const [filterActive, setFilterActive] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch users
        fetch('https://dj-render-ldb1.onrender.com/users/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => setUsers(data))
        .then(() => setIsLoading(false)) 
        .catch(error => console.error('Error:', error));

        // Fetch session durations
        fetch('https://dj-render-ldb1.onrender.com/total_sessions_duration/')
            .then(response => response.json())
            .then(data => setSessionDurations(data));
    }, []);

    // Merge users and session durations
    const mergedUsers = users.map(user => {
        const sessionDuration = sessionDurations.find(item => item.userEmail === user.email);
        return {
            ...user,
            Total_Session_Duration: sessionDuration ? sessionDuration.Total_Session_Duration : 0,
            Total_Session_Duration_Txt: sessionDuration ? sessionDuration.Total_Session_Duration_Txt : '0 minutes'
        };
    });
    
    const filteredUsers = mergedUsers.filter(user => {
        let userValue = user.username.toLowerCase();
        let term = searchTerm.toLowerCase();

        switch (filterType) {
            case 'startsWith':
                return userValue.startsWith(term);
            case 'endsWith':
                return userValue.endsWith(term);
            default:
                return userValue.includes(term);
        }
    }).filter(user => {
        switch (filterActive) {
            case 'active':
                return user.is_active;
            case 'inactive':
                return !user.is_active;
            case 'staff':
                return user.is_staff;
            case 'superusers':
                return user.is_superuser;
            default:
                return true;
        }
    });

    const toggleIsActive = (user) => {
        toggleUserStatus(user, 'is_active', 'https://dj-render-ldb1.onrender.com/suspend/');
    };
    
    const toggleIsStaff = (user) => {
        toggleUserStatus(user, 'is_staff', 'https://dj-render-ldb1.onrender.com/update_user_staff_status/');
    };
    
    const toggleIsSuperuser = (user) => {
        toggleUserStatus(user, 'is_superuser', 'https://dj-render-ldb1.onrender.com/update_user_superuser_status/');
    };
    
    const toggleUserStatus = (user, statusField, url) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                [statusField]: user[statusField] ? "False" : "True",
            }),
        })
        .then(() => {
            const updatedUsers = users.map(u => u.email === user.email ? { ...u, [statusField]: !u[statusField] } : u);
            setUsers(updatedUsers);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    if (isLoading) {
        return <div>Loading...</div>; // Replace this with your skeleton loading screen
    }


    // Get current users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col h-[90vh] gap-5 overflow-y-scroll items-center justify-center">
            <h1 className="text-xl">Users: {filteredUsers.length}</h1>
            <div className="flex max-sm:flex-col justify-center text-center gap-5 items-center flex-wrap">
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={event => setSearchTerm(event.target.value)}
                    className="p-2 mb-4 border-2 border-c_2 rounded-md"
                />
                <select
                    value={filterType}
                    onChange={event => setFilterType(event.target.value)}
                    className="p-2 mb-4 border-2 border-c_2 rounded-md"
                >
                    <option value="contains">Contains</option>
                    <option value="startsWith">Starts with</option>
                    <option value="endsWith">Ends with</option>
                </select>
                <select 
                    value={filterActive} 
                    onChange={e => setFilterActive(e.target.value)} 
                    className="form-select block w-full p-2 mb-4 border-2 border-c_2 rounded-md"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="staff">Staff</option>
                    <option value="superusers">Superusers</option>
                </select>
            </div>
            <div className="flex bg-c_5 p-3 rounded-md shadow-md flex-wrap h-[80vh] overflow-y-scroll items-center justify-center">
                {filteredUsers.length === 0 ? 
                    <div>No users found</div> 
                : 
                <>
                    {currentUsers.map(user => (
                        <div key={user.id} className=" flex max-sm:flex-col gap-5 justify-between items-center border-2 max-sm:w-[70%] w-full border-c_2 p-4 m-2 rounded-md ">
                            <div>
                                <h2 className="text-xl max-sm:text-[100%] font-bold mb-2">{user.username}</h2>
                                <p className="text-gray-700 max-sm:text-[75%]">{user.email}</p>
                                <p className="text-gray-700 max-sm:text-[90%]">{user.is_active ? 'Active' : 'Not Active'}</p>
                                <p className="text-sm">Total Time On Site: {user.Total_Session_Duration_Txt}</p>
                            </div>
                            <div className="flex space-x-4">
                                <label className="flex cursor-pointer items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={user.is_active} 
                                        onChange={() => toggleIsActive(user)}
                                        className="form-checkbox cursor-pointer h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Active</span>
                                </label>
                                <label className="flex cursor-pointer items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={user.is_staff} 
                                        onChange={() => toggleIsStaff(user)}
                                        className="form-checkbox cursor-pointer h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Staff</span>
                                </label>
                                <label className="flex cursor-pointer items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={user.is_superuser} 
                                        onChange={() => toggleIsSuperuser(user)}
                                        className="form-checkbox cursor-pointer h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Superuser</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </>
                }
            </div>
            <div className="pagination flex flex-wrap justify-center  space-x-2 space-y-2 ">
                {Array(Math.ceil(filteredUsers.length / usersPerPage)).fill().map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => paginate(idx + 1)}
                        className={`px-3 py-1 border-2 hover:bg-c_2 hover:text-white border-c_2 rounded-md ${currentPage === idx+1 ? 'bg-c_2 text-white' : ''}`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Users;