import React, { useEffect, useRef, useState } from "react";
import data from "../../data.json";

const { workExperience } = data;

const JobPoint = ({ point }) => {
  const [isVisible, setIsVisible] = useState(false);
  const pointRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(pointRef.current);
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (pointRef.current) {
      observer.observe(pointRef.current);
    }

    return () => {
      if (pointRef.current) {
        observer.unobserve(pointRef.current);
      }
    };
  }, []);

  return (
    <li
      ref={pointRef}
      className={`relative pl-6 mb-4 transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
      }`}
    >
      <span className="absolute left-0 text-2xl text-[#5fb8f8] leading-none transform -translate-y-1/4">
        &bull;
      </span>
      {point}
    </li>
  );
};

const CompanyExperience = ({ job }) => {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-[#5fb8f8] mb-2">{job.company}</h3>
      <h4 className="text-xl font-semibold text-white mb-2">{job.title}</h4>
      <p className="text-md text-gray-400 mb-4">{job.duration}</p>
      <ul className="list-none text-gray-300">
        {job.points.map((point, index) => (
          <JobPoint key={index} point={point} />
        ))}
      </ul>
    </div>
  );
};

const WorkExperience = () => {
  return (
    <section id="work-experience" className="py-16">
      <h5 className="text-center">My Professional Journey</h5>
      <h2 className="text-center mb-12">Work Experience</h2>
      <div className="container mx-auto px-4 md:px-10">
        {workExperience.map((job, index) => (
          <CompanyExperience key={index} job={job} />
        ))}
      </div>
    </section>
  );
};

export default WorkExperience;
