import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomButton from '../Ui components/CustomButton';

const Faqs = ({id}) => {
  const faqs = [
    { question: "What is the college admission process?", answer: "The admission process involves filling out an online application, submitting transcripts, and completing an entrance exam." },
    { question: "Is there an entrance exam for this college?", answer: "Yes, the college conducts an entrance exam for specific courses. Make sure to check the course requirements." },
    { question: "What scholarships are available?", answer: "There are several merit-based and need-based scholarships available. You can apply through the college's scholarship portal." },
    { question: "How can I check the college rankings?", answer: "College rankings are published annually by multiple ranking agencies. You can find them on the college's official website and trusted education portals." },
    { question: "What is the student-faculty ratio?", answer: "The student-faculty ratio at this college is 15:1, providing students with personalized attention and support." },
    { question: "Are there any extracurricular activities?", answer: "Yes, the college offers a wide range of extracurricular activities including sports, cultural clubs, and academic societies." },
    { question: "How is the campus infrastructure?", answer: "The campus is equipped with modern facilities including libraries, sports complexes, computer labs, and hostels." },
    { question: "What are the hostel accommodation options?", answer: "The college provides both single and shared hostel accommodations for students, with all necessary amenities." },
    { question: "Is there a career services department?", answer: "Yes, the college has a dedicated career services department that helps students with internships, job placements, and career counseling." },
    { question: "What are the common career paths for graduates?", answer: "Graduates from this college pursue careers in various fields such as engineering, business, healthcare, and education, with many securing positions in top companies." }
  ];

  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl mb-5 sm:p-4">
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h3 className="text-xl font-bold">Questions & Answers</h3>
          <h4 className="font-semibold opacity-75">({faqs.length} Questions)</h4>
        </div>
        <CustomButton
          text='Ask our experts'
          className="!bg-red-500 !text-sm font-medium !px-[2.5vw] !py-3 !w-auto !h-auto !rounded-lg"
          to={`/questionandAnswer/${id}`}
        />
      </div>

      <div
        className="border-2 rounded-xl p-3 overflow-hidden transition-all"
        style={{ maxHeight: showMore ? '1000px' : 'calc(8 * 60px)' }} // adjust the 60px for your accordion item height
      >
        {faqs.slice(0, showMore ? faqs.length : 8).map((faq, index) => (
          <Accordion key={index} className='!border-none'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}-content`}
              id={`panel${index + 1}-header`}
              className='text-md font-semibold'
            >
              {faq.question}
            </AccordionSummary>
            <AccordionDetails>
              {faq.answer}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      <button
        onClick={() => setShowMore(!showMore)}
        className="text-blue-600 mt-2"
      >
        {showMore ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
}

export default Faqs;
