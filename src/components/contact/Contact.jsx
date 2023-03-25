import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { MdOutlineEmail } from 'react-icons/md';
import './contact.css';

const Contact = () => {
  const form = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_h518uyn',
        'template_yvt8hiv',
        form.current,
        'giprH15mKU9sv5Jnb'
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  };
  return (
    <section id='contact'>
      <h5>Get in touch</h5>
      <h2>Contact Me</h2>
      <div className='container contact__container'>
        <div className='contact__options'>
          <article className='contact__option'>
            <MdOutlineEmail className='contact__option-icon' />
            <h4>Email</h4>
            <h4>dhawalpandya.01@gmail.com</h4>
            <a href='mailto:dhawalpandya.01@gmail.com'>Send a message</a>
          </article>
          <article className='contact__option'>
            <MdOutlineEmail className='contact__option-icon' />
            <h4>Mobile</h4>
            <h4>+91 90990 81738</h4>
            <a href='tel:+919099081738'>Call me</a>
          </article>
        </div>
        <form ref={form} onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Your Full Name'
            name='name'
            required
          />
          <input type='email' placeholder='Your Email' name='email' required />
          <textarea
            placeholder='Your Message'
            rows='7'
            name='message'
            required
          ></textarea>
          <button type='submit' className='btn btn-primary'>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
