import React from 'react'
import ExpandedBox from '../Ui components/ExpandedBox'

const CollegeInfo = ({instituteData}) => {

    const contentData = [
        {
          title: "Introduction",
          content: `
            The Indian Institute of Science (IISc) Bangalore, established in 1909, is widely regarded as one of India's most prestigious institutions for research and higher education. The institute focuses on cutting-edge research in various fields, especially in science, engineering, and technology. IISc's robust academic environment attracts students and researchers from all over the world, making it a hub of innovation and knowledge.
          `
        },
        {
          title: "Undergraduate Programs",
          content: `
            IISc offers undergraduate, postgraduate, and doctoral programs. For undergraduate admissions, IISc has specific requirements based on competitive exams like JEE Main, JEE Advanced, and KVPY (Kishore Vaigyanik Protsahan Yojana). The admission process for these programs is highly selective, with cutoffs varying each year depending on the performance of applicants.
          `
        },
        {
          title: "Admission Cutoffs",
          content: `
            For example, in 2022, the cutoff for JEE Advanced for B.Sc Research programs ranged from 241 to 353 in the general category. Students who clear these exams can apply to various research-oriented courses at IISc. For postgraduate courses, IISc admits students through GATE (Graduate Aptitude Test in Engineering) for M.Tech programs, while for MSc and Ph.D. admissions, IISc conducts its own entrance exams.
          `
        },
        {
          title: "Postgraduate Programs",
          content: `
            IISc offers a wide array of undergraduate and postgraduate programs. The institute is particularly known for its research-driven approach and focus on interdisciplinary studies.
          `
        }
      ];



  return (
    <div className='min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] rounded-xl mb-5 p-2 '>
        <ExpandedBox contentData={contentData} instituteData={instituteData}/>
    </div>
  )
}

export default CollegeInfo