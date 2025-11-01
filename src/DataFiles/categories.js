import { useState, useEffect } from 'react';
import axiosInstance from '../ApiFunctions/axios';

const useCategories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegeResponse, examResponse, coursesResponse] = await Promise.all([
          axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/streams?limit=15&sort={"createdAt":"asc"}`),
          axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/streams?limit=15&sort={"createdAt":"asc"}`),
          axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/courses?filters={"isCoursePopular":true}&limit=15&sort={"createdAt":"asc"}`),
        ]);
        console.log('coursesResponse',coursesResponse)

        // Transform API data to match required format and filter out inactive items
        const collegeItems = collegeResponse.data?.data?.result?.filter(item => item.status == true).map((item, index) => ({
          id: index + 1,
          name: item.name,
        }));

        const examItems = examResponse.data?.data?.result.map((item, index) => ({
          id: index + 1,
          name: item.name,
        }));

        const courseItems = coursesResponse.data?.data?.result.map((item, index) => ({
          id: index + 1,
          name: item.courseTitle,
        })) || [];


        const updatedCategories = [
          {
            label: 'Colleges',
            sidebarItems: collegeItems,
      contents: {
        1: [
          [
            { name: 'Top MBA Colleges in India', link: '#' },
            { name: 'Top MBA Colleges in Bangalore', link: '#' },
            { name: 'Top MBA Colleges in Pune', link: '#' },
            { name: 'Top MBA Colleges in Ranchi', link: '#' },
            { name: 'Top MBA Colleges in Delhi', link: '#' },
          ],
          [
            { name: 'Top MBA Colleges in Chennai', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          ],
          [
            { name: 'Top MBA Colleges in Chennai', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          ],
          [
            { name: 'Top MBA Colleges in Chennai', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
            { name: 'Top MBA Colleges in Hyderabad', link: '#' },
          ],
        ],
        2: [
          [
            { name: 'BTech in Computer Science', link: '#' },
            { name: 'BTech in Mechanical Engineering', link: '#' },
          ],
          [
            { name: 'MBA in Marketing', link: '#' },
            { name: 'MBA in Finance', link: '#' },
          ],
        ],
        3: [
          [
            { name: 'CAT Exam', link: '#' },
            { name: 'GATE Exam', link: '#' },
            { name: 'GMAT Exam', link: '#' },
          ],
          [
            { name: 'XAT Exam', link: '#' },
            { name: 'MAT Exam', link: '#' },
          ],
        ],
        4: [
          [
            { name: 'Colleges in Bangalore', link: '#' },
            { name: 'Colleges in Pune', link: '#' },
            { name: 'Colleges in Delhi', link: '#' },
          ],
          [
            { name: 'Colleges in Chennai', link: '#' },
            { name: 'Colleges in Hyderabad', link: '#' },
          ],
        ],
        5: [
          [
            { name: 'IIM Bangalore vs IIM Ahmedabad', link: '#' },
            { name: 'IIT Delhi vs IIT Bombay', link: '#' },
          ],
          [
            { name: 'BITS Pilani vs VIT', link: '#' },
          ],
        ],
        6: [
          [
            { name: 'IIM Ahmedabad Reviews', link: '#' },
            { name: 'IIT Bombay Reviews', link: '#' },
          ],
          [
            { name: 'IIM Lucknow Reviews', link: '#' },
            { name: 'IIT Madras Reviews', link: '#' },
          ],
        ],
        7: [
          [
            { name: 'CAT Percentile 90+', link: '#' },
            { name: 'CAT Percentile 99+', link: '#' },
          ],
        ],
        8: [
          [
            { name: 'MBA College Predictor', link: '#' },
            { name: 'Engineering College Predictor', link: '#' },
          ],
        ],
        9: [
          [
            { name: 'Talk to MBA Students at IIM', link: '#' },
            { name: 'Talk to MBA Students at XLRI', link: '#' },
          ],
        ],
        10: [
          [
            { name: 'Free Study Materials', link: '#' },
            { name: 'Mock Test Resources', link: '#' },
          ],
          [
            { name: 'Interview Preparation Guides', link: '#' },
          ],
        ],
        11: [
          [
            { name: 'MBA in Operations', link: '#' },
            { name: 'MBA in HR', link: '#' },
          ],
          [
            { name: 'MBA in Business Analytics', link: '#' },
          ],
        ],
      },
    },
    
  
    {
      label: 'Courses',
    },
    {
      label: 'Careers',
      sidebarItems: [
        { id: 1, name: 'Top Ranked Colleges' },
        { id: 2, name: 'Popular Courses' },
        { id: 3, name: 'Exams' },
        { id: 4, name: 'Colleges By Location' },
        { id: 5, name: 'Compare Colleges' },
      ],
      contents: {
        1: [
          [
            { name: 'Top Design Colleges in India', link: '#' },
            { name: 'Top Design Colleges in Delhi', link: '#' },
          ],
          [
            { name: 'Top Design Colleges in Mumbai', link: '#' },
            { name: 'Top Design Colleges in Bangalore', link: '#' },
          ],
        ],
        2: [
          [
            { name: 'B.Des', link: '#' },
            { name: 'M.Des', link: '#' },
          ],
          [
            { name: 'Fashion Design', link: '#' },
            { name: 'Interior Design', link: '#' },
          ],
        ],
        3: [
          [
            { name: 'NID Entrance Exam', link: '#' },
            { name: 'CEED Exam', link: '#' },
          ],
          [
            { name: 'NIFT Exam', link: '#' },
            { name: 'UPES DAT', link: '#' },
          ],
        ],
        4: [
          [
            { name: 'Colleges in Delhi', link: '#' },
            { name: 'Colleges in Mumbai', link: '#' },
          ],
          [
            { name: 'Colleges in Bangalore', link: '#' },
            { name: 'Colleges in Pune', link: '#' },
          ],
        ],
        5: [
          [
            { name: 'College A vs College B', link: '#' },
            { name: 'College C vs College D', link: '#' },
          ],
          [
            { name: 'College E vs College F', link: '#' },
            { name: 'College G vs College H', link: '#' },
          ],
        ],
      },
    },
    {
      label: 'Latest Updates',
      sidebarItems: [
        { id: 1, name: 'Top Ranked Colleges' },
        { id: 2, name: 'Popular Courses' },
        { id: 3, name: 'Exams' },
        { id: 4, name: 'Colleges By Location' },
        { id: 5, name: 'Compare Colleges' },
      ],
      contents: {
        1: [
          [
            { name: 'Top Media Colleges in India', link: '#' },
            { name: 'Top Media Colleges in Delhi', link: '#' },
   { name: 'Top Media Colleges in Mumbai', link: '#' },
            { name: 'Top Media Colleges in Bangalore', link: '#' },
          ],
          [
            { name: 'Top Media Colleges in Chennai', link: '#' },
            { name: 'Top Media Colleges in Pune', link: '#' },
          ],
        ],
        2: [
          [
            { name: 'BA in Journalism', link: '#' },
            { name: 'BSc in Film Production', link: '#' },
          ],
          [
            { name: 'MA in Mass Communication', link: '#' },
            { name: 'Diploma in Photography', link: '#' },
          ],
        ],
        3: [
          [
            { name: 'JMC Entrance Exam', link: '#' },
            { name: 'FTII Entrance Exam', link: '#' },
          ],
          [
            { name: 'XIC Entrance Exam', link: '#' },
            { name: 'Symbiosis Entrance Exam', link: '#' },
          ],
        ],
        4: [
          [
            { name: 'Colleges in Delhi', link: '#' },
            { name: 'Colleges in Mumbai', link: '#' },
          ],
          [
            { name: 'Colleges in Bangalore', link: '#' },
            { name: 'Colleges in Kolkata', link: '#' },
          ],
        ],
        5: [
          [
            { name: 'College A vs College B', link: '#' },
            { name: 'College C vs College D', link: '#' },
          ],
          [
            { name: 'College E vs College F', link: '#' },
            { name: 'College G vs College H', link: '#' },
          ],
        ],
      },
    },
    {
      label: 'More',
      sidebarItems: [
        { id: 1, name: 'Top Ranked Colleges' },
        { id: 2, name: 'Popular Courses' },
        { id: 3, name: 'Exams' },
        { id: 4, name: 'Colleges By Location' },
        { id: 5, name: 'Compare Colleges' },
      ],
      contents: {
        1: [
          [
            { name: 'Top Tourism Colleges in India', link: '#' },
            { name: 'Top Tourism Colleges in Delhi', link: '#' },
          ],
          [
            { name: 'Top Tourism Colleges in Mumbai', link: '#' },
            { name: 'Top Tourism Colleges in Bangalore', link: '#' },
          ],
        ],
        2: [
          [
            { name: 'BTTM', link: '#' },
            { name: 'BHM', link: '#' },
          ],
          [
            { name: 'MBA in Tourism', link: '#' },
            { name: 'Diploma in Travel and Tourism', link: '#' },
          ],
        ],
        3: [
          [
            { name: 'NCHMCT JEE', link: '#' },
            { name: 'IHM Entrance Exam', link: '#' },
          ],
          [
            { name: 'Travel and Tourism Entrance Exam', link: '#' },
            { name: 'BHMCT Entrance Exam', link: '#' },
          ],
        ],
        4: [
          [
            { name: 'Colleges in Delhi', link: '#' },
            { name: 'Colleges in Mumbai', link: '#' },
          ],
          [
            { name: 'Colleges in Bangalore', link: '#' },
            { name: 'Colleges in Goa', link: '#' },
          ],
        ],
        5: [
          [
            { name: 'College A vs College B', link: '#' },
            { name: 'College C vs College D', link: '#' },
          ],
          [
            { name: 'College E vs College F', link: '#' },
            { name: 'College G vs College H', link: '#' },
          ],
        ],
      },
    }
  ];

  console.log('updatedCategories', updatedCategories);
  setCategoriesData(updatedCategories);
  setLoading(false);
} catch (err) {
  setError(err.message);
  setLoading(false);
}
};

fetchData();
}, []);

return { categoriesData, loading, error };
};

export default useCategories;