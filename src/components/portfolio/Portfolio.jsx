import React from "react";
import data from "../../data.json";

const Portfolio = () => {
  const { soloProjects, soloAiProjects } = data;

  return (
    <>
      <section id="ai-portfolio" className="mt-20">
        <h5>My recent work in AI</h5>
        <h2>AI/ML Projects</h2>

        <div className="container mx-auto grid grid-cols-1 gap-10 text-center md:grid-cols-2 lg:grid-cols-3">
          {soloAiProjects.map((proj, index) => (
            <article
              key={index}
              className="flex h-[30rem] flex-col justify-between rounded-3xl border border-transparent bg-[#2c2c6c] p-5 transition-all duration-400 ease-in-out hover:border-[#5fb8f8] hover:bg-transparent"
            >
              <div className="h-1/2 overflow-hidden rounded-2xl">
                <img
                  src={proj.img}
                  alt={proj.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl">{proj.title}</h3>
                {proj.language && (
                  <h4 className="mb-5 font-light italic opacity-50">
                    {proj.language.join(", ")}
                  </h4>
                )}
                <div className="mb-4 flex justify-center gap-4 text-center">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                    >
                      Code
                    </a>
                  )}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="portfolio">
        <h5>My recent work in Web Development</h5>
        <h2>Web Dev Projects</h2>

        <div className="container mx-auto grid grid-cols-1 gap-10 text-center md:grid-cols-2 lg:grid-cols-3">
          {soloProjects.map((proj, index) => (
            <article
              key={index}
              className="flex h-[30rem] flex-col justify-between rounded-3xl border border-transparent bg-[#2c2c6c] p-5 transition-all duration-400 ease-in-out hover:border-[#5fb8f8] hover:bg-transparent"
            >
              <div className="h-1/2 overflow-hidden rounded-2xl">
                <img
                  src={proj.img}
                  alt={proj.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl">{proj.title}</h3>
                {proj.language && (
                  <h4 className="mb-5 font-light italic opacity-50">
                    {proj.language.join(", ")}
                  </h4>
                )}
                <div className="mb-4 flex justify-center gap-4 text-center">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                    >
                      Code
                    </a>
                  )}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Portfolio;
