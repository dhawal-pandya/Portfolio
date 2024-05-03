import React, { useRef } from "react";
import { MdOutlineEmail } from "react-icons/md";
import "./contact.css";

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
      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <MdOutlineEmail className="contact__option-icon" />
            <h4>Email</h4>
            <h4>dhawalpandya.01@gmail.com</h4>
            <a href="mailto:dhawalpandya.01@gmail.com">Send a message</a>
          </article>
          <article className="contact__option">
            <MdOutlineEmail className="contact__option-icon" />
            <h4>Mobile</h4>
            <h4>+91 90990 81738</h4>
            <a href="tel:+919099081738">Call me</a>
          </article>
        </div>
        <form ref={form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Full Name"
            name="full name"
            required
          />
          <input type="email" placeholder="Your Email" name="email" required />
          <textarea
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
