import React from "react";
// import { FaAward } from 'react-icons/fa';
import { VscFolderLibrary } from "react-icons/vsc";
import ME from "../../assets/me.png";

const Intro = ({ toggleWorkExperience, isWorkExperienceVisible }) => {
  return (
    <section id="about">
      <h5>Get to know</h5>
      <h2>About Me</h2>
      <div className="container mx-auto grid grid-cols-1 gap-0 md:grid-cols-[35%_50%] md:gap-[15%]">
        <div className="mx-auto my-8 grid w-1/2 aspect-square place-items-center rounded-full bg-gradient-to-r from-transparent via-[#5fb8f8] to-transparent md:my-0 md:w-full">
          <div className="h-full w-full overflow-hidden rounded-full transition-transform duration-400 ease-in-out hover:scale-125">
            <img src={ME} alt="me" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className="mb-6 block gap-6 md:grid">
            {/* <article className='about__card'>
              <FaAward className='about__icon' />
              <h5>Certificates</h5>
              <small></small>
            </article> */}
            <a href="#portfolio">
              <article className="cursor-default rounded-2xl border border-transparent bg-[#2c2c6c] p-8 text-center transition-all duration-400 ease-in-out hover:border-[#4db5ff66] hover:bg-transparent">
                <VscFolderLibrary className="mx-auto mb-4 text-2xl text-[#5fb8f8]" />
                <h5 className="text-base">Projects</h5>
                <small className="text-sm text-gray-300">
                  9+ Completed Projects
                </small>
              </article>
            </a>
          </div>
          <p className="my-6 text-gray-300 md:my-8">
            Hello, I am Dhawal, a tech-savvy problem solver who approaches
            challenges with an insatiable hunger for knowledge.
            <br />
            <br />
            My approach to problem-solving involves delving deeply into the
            intricacies of the issue at hand, ensuring that I am equipped with
            the tools and expertise needed to devise a successful solution.
            <br />
            <br />
            One aspect of my work that I take immense pride in is my attention
            to detail. Every line of code that I write is imbued with a level of
            watchfulness that ensures optimal functionality and performance.
            <br />
            <br />
            I have been awarded a 5 ⭐ Gold Badge from HackerRank, attesting to
            my prowess in tackling complex coding challenges.
            <br />
            <br />
            So, if you're seeking a knowledgeable, detail-oriented, and
            ambitious tech professional to collaborate with on your next
            project, I invite you to click on the button below and start a
            conversation with me.
          </p>
          <div className="flex justify-center gap-4 md:justify-start">
            <a href="#contact" className="btn btn-primary">
              Let's Talk
            </a>
            <button className="btn" onClick={toggleWorkExperience}>
              {isWorkExperienceVisible ? "Show Less" : "Tell Me More"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
