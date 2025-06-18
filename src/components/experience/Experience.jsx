import React from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import data from "../../data.json";

const Experience = () => {
  const { experiences } = data;

  return (
    <section id="experience">
      <h5>I am skilled</h5>
      <h2>At</h2>
      <div className="container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
        {experiences.map(({ title, skills }) => (
          <div
            key={title}
            className="cursor-default rounded-[2rem] border border-transparent bg-[#2c2c6c] p-8 transition-all duration-400 ease-in-out hover:border-[#4db5ff66] hover:bg-transparent lg:p-10"
          >
            <h3 className="mb-4 text-center text-xl text-[#5fb8f8]">{title}</h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {skills.map((skill) => (
                <article key={skill} className="flex items-start gap-4">
                  <BsFillPatchCheckFill className="mt-1.5 shrink-0 text-[#5fb8f8]" />
                  <div>
                    <h4 className="text-lg font-bold">{skill}</h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
