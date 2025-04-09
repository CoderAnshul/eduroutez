import React from "react";
import PageBanner from "../Ui components/PageBanner";
import aboutimg from "../assets/Images/aboutimg.png";
import { Link } from "react-router-dom";
import Instructor from "../Components/Instructor";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";

const Aboutus = () => {
  return (
    <>
      <PageBanner pageName="About us" currectPage="about us" />
      <section className="py-16 bg-gradient-to-r from-[#f3f4f6] via-[#f9f9fa] to-[#fef7f3]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Start your journey With us
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We offer a brand new approach to the most basic learning paradigms.
            Choose from a wide range of learning options and gain new skills!
            Our school is known.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 px-4 md:px-8 lg:px-12">
          {[
            {
              id: 1,
              title: "Expert Teacher",
              color: "bg-red-100",
              numberColor: "text-red-600",
              para: "Learn from experienced and skilled instructors.",
            },
            {
              id: 2,
              title: "Quality Education",
              color: "bg-blue-100",
              numberColor: "text-blue-600",
              para: "Access top-notch resources for better learning.",
            },
            {
              id: 3,
              title: "Remote Learning",
              color: "bg-pink-100",
              numberColor: "text-pink-600",
              para: "Study anytime, anywhere with total ease.",
            },
            {
              id: 4,
              title: "Life Time Support",
              color: "bg-teal-100",
              numberColor: "text-teal-600",
              para: "Get lifelong guidance for your success journey.",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex flex-col  items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-[260px] hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex  items-center gap-3">
                <div
                  className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
                >
                  <span
                    className={`${item.numberColor} text-lg font-semibold`}
                  >{`0${item.id}`}</span>
                </div>
                {/* Use dangerouslySetInnerHTML to insert the title with a <br /> */}
                <h3
                  className="text-lg font-bold text-gray-800 mb-2"
                  dangerouslySetInnerHTML={{
                    __html: item.title.replace(" ", "<br />"),
                  }}
                ></h3>
              </div>
              <p className="text-gray-500 text-center">
                {/* Lorem ipsum dolor sit amet, consectetur notted adipisicing elit ut labore. */}
                {item.para}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------- aboutimg---------------- */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Image Section */}
          <div className="relative flex-1">
            <img
              src={aboutimg} // Replace with your actual image source
              alt="Main"
              className="rounded-lg"
            />
          </div>

          {/* Right Content Section */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-500 mb-4">
              Eduroutez.com simplifies higher education navigation with
              accurate, up-to-date insights on colleges, courses, and admissions
              in India and abroad. Our user-friendly platform empowers students,
              parents, and educators to make informed decisions and achieve
              academic goals.
            </p>
            {/* <p className="text-gray-500 mb-6">
            We offer a brand new approach to the most basic learning paradigms.
            Choose from a wide range of learning options and gain new skills!
            Our school is known.
          </p> */}

            {/* Bullet Points */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-blue-600 mt-[2px]">✔</span>
                Find your perfect college fit with Eduroutez.com’s trusted
                insights and tools.
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-blue-600 mt-[2px]">✔</span>
                Navigate higher education effortlessly with our user-friendly
                platform.
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-blue-600 mt-[2px]">✔</span>
                Empowering students and educators with accurate, up-to-date
                academic resources.
              </li>
            </ul>

            {/* CTA Button */}
            <Link
              to="/searchpage"
              className="inline-block bg-blue-600 text-white px-6 py-3  font-semibold hover:bg-blue-700 transition duration-300"
            >
              View All Courses <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Instructor />
      <div className="flex gap-2 flex-col sm:flex-row items-center mt-2">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default Aboutus;
