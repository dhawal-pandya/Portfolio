import React, { useRef } from "react";
import { MdOutlineEmail } from "react-icons/md";

const Contact = () => {
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);

    fetch(
      "https://script.google.com/macros/s/AKfycbxFCgBlHjtCyUu62J-tE-qBZVQ02vxiQuFyEy6G0qRnZzJw9KYukcl1HOuQnwywFK82zQ/exec",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Form submitted successfully");
        } else {
          console.error("Form submission failed");
        }
      })
      .catch((error) => console.error("Error:", error));

    e.target.reset();
  };

  return (
    <section id="contact">
      <h5>Get in touch</h5>
      <h2>Contact Me</h2>
      <div className="container mx-auto grid w-[58%] grid-cols-1 gap-[12%] md:grid-cols-[30%_58%]">
        <div className="flex flex-col gap-5">
          <article className="h-44 rounded-2xl border border-transparent bg-[#2c2c6c] p-5 text-center transition-all duration-400 ease-in-out hover:border-[#4db5ff66] hover:bg-transparent">
            <MdOutlineEmail className="mx-auto mb-2 text-2xl" />
            <h4 className="text-[87%] font-medium opacity-80">Email</h4>
            <h4 className="break-words text-[87%] font-medium opacity-80">
              dhawalpandya.01@gmail.com
            </h4>
            <a
              href="mailto:dhawalpandya.01@gmail.com"
              className="mt-3 inline-block text-sm"
            >
              Send a message
            </a>
          </article>
          <article className="h-44 rounded-2xl border border-transparent bg-[#2c2c6c] p-5 text-center transition-all duration-400 ease-in-out hover:border-[#4db5ff66] hover:bg-transparent">
            <MdOutlineEmail className="mx-auto mb-2 text-2xl" />
            <h4 className="text-[87%] font-medium opacity-80">Mobile</h4>
            <h4 className="text-[87%] font-medium opacity-80">
              +91 90990 81738
            </h4>
            <a href="tel:+919099081738" className="mt-3 inline-block text-sm">
              Call me
            </a>
          </article>
        </div>
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <input
            className="w-full rounded-lg border-2 border-[#4db5ff66] bg-transparent p-3 text-white placeholder-white/80 focus:outline-none"
            type="text"
            placeholder="Your Full Name"
            name="full name"
            required
          />
          <input
            className="w-full rounded-lg border-2 border-[#4db5ff66] bg-transparent p-3 text-white placeholder-white/80 focus:outline-none"
            type="email"
            placeholder="Your Email"
            name="email"
            required
          />
          <textarea
            className="w-full resize-none rounded-lg border-2 border-[#4db5ff66] bg-transparent p-3 text-white placeholder-white/80 focus:outline-none"
            placeholder="Your Message"
            rows="7"
            name="message"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
