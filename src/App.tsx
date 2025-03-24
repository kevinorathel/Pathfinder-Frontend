import React, { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';

type Program = 'IT' | 'DA' | 'CS';
type Career = string;

async function fetchCourseRecommendations(deptId: number, jobTitle: string) {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/pathway/getCourseRecommendation?deptId=${deptId}&jobTitle=${encodeURIComponent(jobTitle)}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching course recommendations:', error);
    return [];
  }
}

function App() {
  const [selectedProgram, setSelectedProgram] = useState<Program | ''>('');
  const [career, setCareer] = useState<Career>('');
  const [courseRecommendations, setCourseRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCourseClick = (course: any) => {
    console.log("Course clicked:", course.courseName); // Debugging log
    setSelectedCourse(course);
    setIsModalOpen(true);
};


  const handleGetRecommendations = async () => {
    if (selectedProgram && career) {
      const deptId = selectedProgram === 'IT' ? 1 : selectedProgram === 'DA' ? 2 : 3;
      setIsLoading(true);
      try {
        const data = await fetchCourseRecommendations(deptId, career);
        setCourseRecommendations(data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="bg-red-500 h-[10vh]">
        <div className="container mx-auto px-4 h-full flex items-center">
          <h1 className="text-[26px] font-bold text-white">
            Clark University
          </h1>
        </div>
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none h-[50vh]" style={{ backgroundImage: 'url("/clark-watermark.png")' }} />
        <div className="relative z-10 container mx-auto px-4" style={{ marginTop: '40vh' }}>
        <h2 className="text-[30px] font-bold text-black mt-8 flex items-center">PathFinder</h2>
          <div className="flex gap-8">
            <div className="w-[70%]">
              <div className="grid gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-102">
                  <div className="flex items-center gap-4 mb-6">
                    <GraduationCap className="w-6 h-6 text-black" />
                    <h3 className="text-xl font-semibold text-black">Select Your Program</h3>
                  </div>
                  <select 
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value as Program)}
                    className="w-full p-3 border rounded-md bg-white text-black transition-all duration-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200"
                  >
                    <option value="">Select Program</option>
                    <option value="1">Information Technology</option>
                    <option value="2">Data Analytics</option>
                    <option value="3">Computer Science</option>
                  </select>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-102">
                  <div className="flex items-center gap-4 mb-6">
                    <BookOpen className="w-6 h-6 text-black" />
                    <h3 className="text-xl font-semibold text-black">Enter Your Career Goal</h3>
                  </div>
                  <input
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="Enter your career ambition..."
                    className="w-full p-3 border rounded-md bg-white text-black transition-all duration-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-102">
                  <button
                    onClick={handleGetRecommendations}
                    disabled={isLoading}
                    className="w-full p-3 border rounded-md bg-red-500 text-white font-semibold transition-all duration-300 hover:bg-red-300 -600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {isLoading ? 'Loading...' : 'Get Course Recommendations'}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[30%]">
              <img 
                src="/img6.jpg" 
                alt="updated the mans image"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
          {courseRecommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8 transition-all duration-300">
              <h3 className="text-xl font-bold text-black mb-4">Recommended Courses</h3>
              <div className="grid grid-cols-2 gap-6">
                {courseRecommendations.map((course, index) => (
                  <div 
                    key={course.courseId} 
                    className="p-4 bg-gray-50 rounded-md text-black transition-all duration-300 hover:bg-red-50"
                    onClick={() => handleCourseClick(course)} 
                    
                  >
                    <h2 className="font-semibold">{course.courseCode}: {course.courseName}</h2>
                    {/* <p className="mt-2">{course.courseDescription}</p> */}
                  </div>
                ))}
              </div>
            </div>
          )}
             {isModalOpen && selectedCourse && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold text-black">{selectedCourse.courseName}</h2>
        <p className="mt-2 text-gray-700">{selectedCourse.courseDescription}</p>
        <button 
          onClick={() => setIsModalOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
      >
          Close
        </button>
      </div>
    </div>
  )}
        </div>
      </div>
      {isModalOpen && selectedCourse && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md relative">
          <h2 className="text-xl font-bold text-black">{selectedCourse.courseName}</h2>
          <p className="mt-2 text-gray-700">{selectedCourse.courseDescription}</p>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md absolute top-2 right-2"
          >
            ✕
          </button>
        </div>
      </div>
    )}
    </div>
  );
}

export default App;