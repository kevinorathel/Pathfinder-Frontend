import React, { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';

type Program = 'IT' | 'DA' | 'CS';
type Career = string;

async function fetchCourseRecommendations(deptId: number, jobTitle: string) {
  try {
    const response = await fetch(`http://localhost:8080/pathway/getCourseRecommendation?deptId=${deptId}&jobTitle=${encodeURIComponent(jobTitle)}`);
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
          <h2 className="text-[22px] font-bold text-black mb-8">PathFinder</h2>
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
                    className="w-full p-3 border rounded-md bg-blue-500 text-white font-semibold transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {isLoading ? 'Loading...' : 'Get Course Recommendations'}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[30%]">
              <img 
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80" 
                alt="Happy person smiling"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
          {courseRecommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8 transition-all duration-300">
              <h3 className="text-xl font-bold text-black mb-4">Recommended Courses</h3>
              <ul className="space-y-3">
                {courseRecommendations.map((course) => (
                  <li 
                    key={course.courseId}
                    className="p-3 bg-gray-50 rounded-md text-black transition-all duration-300 hover:bg-red-50"
                  >
                    <h4 className="font-semibold">{course.courseCode}: {course.courseName}</h4>
                    <p>{course.courseDescription}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
