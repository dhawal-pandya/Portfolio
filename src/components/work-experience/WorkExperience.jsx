import React, { useEffect, useRef, useState } from "react";

const workExperience = [
  {
    company: "Razorpay",
    title: "Product Development Engineer",
    duration: "July 2024 - Present",
    points: [
      "Part of the core Cards and Recurring Infra team at MandateHQ, a system enabling creation of mandates for recurring payments (e.g., subscriptions for services like Netflix) which handles a traffic volume of 50k/min",
      "Integrated credit card mandate creation in MandateHQ for recurring payments for multiple banks",
      "Took complete ownership and fully integrated Rupay cards for mandates",
      "Led cross-team collaboration to streamline mandate processing and ensure compliance with payments Infrastructure for integration of different networks (Visa, MasterCard, Rupay)",
      "Implemented multi-architecture support (arm64/amd64) for key applications across 4 subsystems",
      "Utilised cross-compilation instead of emulation which resulted in a reduced build time for our code by 84%",
      "Indexed high-usage databases based on logs, reducing DB response time from 200ms down to 50ms",
      "Fixed 30+ vulnerabilities by updating packages and modifying modules to meet PCI DSS standards.",
      "Developed a Prometheus-based dashboard for API tracking for latencies and traffic, enabling failure tracking and real-time alerts.",
      "Optimised API Gateway for improved traffic handling and better performance",
      "Part of the core team managing mandates with on-call responsibilities and using tools like Spinnaker, Coralogix and Zenduty",
    ],
  },
  {
    company: "Neweb Labs",
    title: "Full-Stack Developer",
    duration: "April 2023 - June 2024",
    points: [
      "Coding, debugging, refactoring and maintaining code-base for Go and Java based REST API backend services deployed in production environment",
      "Improved system workflow to be optimised for paid and unpaid video streaming, with the relevant security measures, reducing latencies to 120ms",
      "Wrote 6 core and 5 auxiliary microservices from scratch and took responsibility for seeing it through to completion with its Frontend Applications as well",
      "Integrated Payment Gateways, Stripe and RazorPay into the platform using their SDK and writing custom functions wherever required, which significantly contributed to monetization efforts and increased company revenue",
      "Wrote a low-latency, high-performance media delivery system using AWS S3, optimising performance for large-scale video streaming",
      "Also participated in discussions including selection of suitable technologies for frontend, backend or a DBMS",
    ],
  },
];

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
