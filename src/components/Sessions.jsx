import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';

Chart.register(CategoryScale);
const SessionTable = () => {
    const [sessions, setSessions] = useState([]);
    const [filterEmail, setFilterEmail] = useState('');
    const [filterDuration, setFilterDuration] = useState('');
    const [filterSessionType, setFilterSessionType] = useState('');

    useEffect(() => {
        fetch('https://dj-render-ldb1.onrender.com/unique/') // Replace with your API URL
        .then(response => response.json())
        .then(data => {
            const modifiedData = data.map(session => {
                    if (session.session_for === '') {
                        session.session_for = 'assignment';
                    }
                    return session;
                });
                setSessions(modifiedData);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const filteredSessions = sessions.filter(session => {
        return session.userEmail.includes(filterEmail) 
            && session.Session_Duration >= filterDuration
            && (filterSessionType === '' || session.session_for === filterSessionType);
    });

    const chartData = {
        labels: filteredSessions.map((session, index) => `Session ${index + 1}`),
        datasets: [
            {
                label: 'Session Duration',
                data: filteredSessions.map(session => session.Session_Duration),
                fill: true,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };


    return (
        <div className="flex flex-wrap gap-5 overflow-y-scroll overflow-x-hidden items-start justify-center h-[90dvh]  ">
            
                <Line data={chartData} />
            
            <div className='flex flex-col '>
                <div className='flex flex-wrap gap-1 justify-center items-center self-center'>
                    <input 
                        type="text" 
                        placeholder="Filter by email" 
                        value={filterEmail} 
                        onChange={e => setFilterEmail(e.target.value)} 
                        className="mb-4 p-2 w-[60%] border border-gray-300 rounded"
                    />
                    <select 
                        value={filterSessionType} 
                        onChange={e => setFilterSessionType(e.target.value)} 
                        className="mb-4 p-2 border border-gray-300 rounded"
                    >
                        <option value="">All session types</option>
                        <option value="assignment">Assignment</option>
                        <option value="SA-quiz">SA-quiz</option>
                        <option value="MOT-quiz">MOT-quiz</option>
                    </select>
                    <select 
                        value={filterDuration} 
                        onChange={e => setFilterDuration(e.target.value)} 
                        className="mb-4 p-2 border border-gray-300 rounded"
                    >
                        <option value="">All durations</option>
                        <option value="10">10+ minutes</option>
                        <option value="20">20+ minutes</option>
                        <option value="30">30+ minutes</option>
                    </select>
                </div>
                <div className="shadow h-[40dvh] w-[80vw] overflow-scroll l border-b border-gray-200  sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session For</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Started</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Ended</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Duration Text</th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Duration (minutes)</th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white  divide-y divide-gray-200">
                            {filteredSessions.map((session, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{session.userEmail}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{session.session_for}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{session.Session_Started}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{session.Session_Ended}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{session.Session_Duration_Txt}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">{session.Session_Duration}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        
            
        </div>
    );
};

export default SessionTable;