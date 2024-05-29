import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizReport from './QuizReports';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://dj-render-ldb1.onrender.com/fetchcourse');
                const mappedData = response.data.map(course => ({
                    id: course.id,
                    name: course.Course,
                    semester: course.Semester
                }));
                setCourses(mappedData);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const semesters = [...new Set(courses.map(course => course.semester))];

    return (
        <div className="container mx-auto h-[90dvh] flex flex-col gap-5">
            {selectedCourse ? (
                <>
                    <button className='bg-c_1 dark:text-white text-white hover:text-black border-2 border-c_1 rounded-md hover:bg-opacity-15 hover:bg-black  transition-all duration-200 ease-in p-2 w-fit self-center' onClick={() => setSelectedCourse(null)}>Return to courses</button>
                    <QuizReport courseName={selectedCourse} />
                </>
            ) : (
                <>
                    <div className='bg-c_5  dark:bg-black dark:bg-opacity-25 p-5 flex flex-col shadow-md'>
                        <h1 className="text-2xl dark:text-white self-center font-bold mb-4">Semesters</h1>
                        <div className="flex flex-wrap overflow-auto h-[35dvh] max-sm:h-[30dvh] justify-start">
                            {semesters.map((semester, index) => (
                                <div key={index} className="p-4 border rounded-lg hover:bg-black bg-white dark:hover:text-white transition-all duration-200 hover:bg-opacity-10  shadow-md m-2 cursor-pointer" onClick={() => setSelectedSemester(semester)}>
                                    <h2 className="text-lg font-semibold">{semester}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                    {selectedSemester && (
                        <div className='bg-c_5 dark:bg-black dark:bg-opacity-25 p-5 flex flex-col shadow-md'>
                            <h1 className="text-2xl dark:text-white self-center font-bold mb-4">Courses for {selectedSemester}</h1>
                            <div className="flex flex-wrap  overflow-auto h-[35dvh] max-sm:h-[20dvh] justify-start">
                                {courses.filter(course => course.semester === selectedSemester).map((course) => (
                                    <div key={course.id} className="p-4 border flex justify-center items-center rounded-lg hover:bg-black dark:hover:text-white bg-white transition-all duration-200 hover:bg-opacity-10  shadow-md m-2 cursor-pointer" onClick={() => setSelectedCourse(course.name)}>
                                        <h2 className="text-lg font-semibold">{course.name}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Courses;