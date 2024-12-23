import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import CoursesName from '../Ui components/CoursesName'
import TabSlider from '../Ui components/TabSlider';
import QueryForm from '../Ui components/QueryForm';
import ExpandedBox from '../Ui components/ExpandedBox';
import ProsandCons from '../Ui components/ProsandCons';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import { getCoursesById } from '../ApiFunctions/api';
import { useQuery } from 'react-query';


const tabs = [
    "Overview",
    "Eligibility",
    "Course Curriculum",
    "Fees",
    "Career"
  ];


  const contentData = [
    {
      title: "B.Sc. Research",
      content: `The B.Sc. Research program at IISc is a research-focused undergraduate course in science and technology. It offers students an opportunity to engage in cutting-edge research from the early stages of their academic journey. Admission to this program is highly competitive and is based on performance in competitive exams such as JEE Advanced and KVPY (Kishore Vaigyanik Protsahan Yojana). The program is designed to provide in-depth knowledge in various scientific fields, preparing students for research-oriented careers or further studies in academia or industry.`
    },
    {
      title: "M.Tech",
      content: `The M.Tech (Master of Technology) program at IISc is designed for students who wish to pursue advanced studies in various engineering disciplines. This program focuses on both theoretical knowledge and practical application, with an emphasis on innovation and research. Students can specialize in fields like Mechanical Engineering, Civil Engineering, Electrical Engineering, and more. Admission is based on the Graduate Aptitude Test in Engineering (GATE), and it attracts some of the brightest minds in the country. The program equips students with the skills needed to tackle complex engineering problems and contribute to technological advancements.`
    },
    {
      title: "M.Sc",
      content: `The M.Sc (Master of Science) program at IISc provides a comprehensive education in various science disciplines, such as Physics, Chemistry, Mathematics, and more. This program is research-oriented, with students encouraged to explore cutting-edge scientific topics and engage in laboratory work. The admission process is through IISc's own entrance exam, and students who are selected get access to some of the most prestigious faculty and research opportunities in the country. Graduates of this program are well-equipped to pursue careers in research, teaching, or industry.`
    },
    {
      title: "Ph.D.",
      content: `The Ph.D. program at IISc is designed for individuals who wish to make significant contributions to their field of study through original research. The program is open to students from various disciplines, including science, engineering, and technology. Admission is based on performance in the entrance exam and subsequent interviews. The Ph.D. program at IISc offers an excellent environment for research, with state-of-the-art facilities and mentorship from leading experts. Graduates of the Ph.D. program often go on to work in academia, research institutions, or industry, contributing to innovations and advancements in their respective fields.`
    }
  ];
  

  

const Coursesinfopage = () => {
  const [content, setcontent] = useState()
  const { id } = useParams(); 
  console.log(id);

  const { data: CourseData, isLoading, isError, error } = useQuery(
    ['course', id],
    () => getCoursesById(id),
    {
      enabled: Boolean(id), // Ensures that the query is only triggered if 'id' is truthy
    }
  );

  useEffect(() => {
    setcontent(CourseData?.data);
  }, [CourseData]);
  console.log(content);
    


    const sectionRefs = tabs.map(() => useRef(null));
  return (
    <div className='px-[4vw] py-[2vw] flex flex-col items-start'>
        <CoursesName content={content?.courseTitle}/>
        {/* <div className='w-full overflow-scroll'> */}
        <TabSlider tabs={tabs} sectionRefs={sectionRefs}  />
        {/* </div> */}

        <div className='w-full flex gap-4'>

        {/* -------------main content of college and ads section ------------------- */}
        <div className='w-full lg:w-4/5'>
            <div className='w-full min-h-24'>
                <div ref={sectionRefs[0]} className="min-h-24 pt-4 ">
                    <div className='min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] rounded-xl mb-5 p-2 pt-8'>
                        {/* <ExpandedBox contentData={contentData}/> */}
                        {contentData.map((data,index) =>
                            <div key={index} className="mb-4">
                                <h3 className="text-lg font-bold">{data.title}</h3>
                                <p className="text-base">{data.content}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div ref={sectionRefs[1]} className="min-h-24 pt-4 ">
                    <div className='min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] rounded-xl mb-5 p-2 pt-8'>
                        {/* <ExpandedBox contentData={contentData}/> */}
                        {contentData.map((data,index) =>
                            <div key={index} className="mb-4">
                                <h3 className="text-lg font-bold">{data.title}</h3>
                                <p className="text-base">{data.content}</p>
                            </div>
                        )}
                    </div>
                </div>
                <ProsandCons/>
            </div>
        </div>
        <QueryForm/>

        </div>
        <BestRated/>
        <Events/>
    </div>
  )
}

export default Coursesinfopage