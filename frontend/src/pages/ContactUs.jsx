import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, Phone, MessageSquare } from 'lucide-react';
import img from '../assets/contactus.jpg';

const AlertMessage = ({ type, message }) => {
  const alertStyles = {
    success: "bg-green-100 border-l-4 border-green-500 text-green-700",
    error: "bg-red-100 border-l-4 border-red-500 text-red-700"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 my-4 ${alertStyles[type]}`}
    >
      <p className="font-medium">{message}</p>
    </motion.div>
  );
};

const InputField = ({ icon: Icon, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.02 }}
    className="relative"
  >
    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    <input
      {...props}
      className="w-full p-4 pl-12 text-base border-2 border-gray-200 rounded-lg transition-all duration-300 
        focus:border-[#3b6fa6] focus:ring-2 focus:ring-[#4f80b5] focus:ring-opacity-20 outline-none 
        hover:border-[#4f80b5] hover:shadow-lg hover:shadow-[#4f80b570]"
    />
  </motion.div>
);

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="min-h-screen pb-20 bg-gradient-to-r from-[#f8fbff] to-white">
      <motion.div 
        className="container mx-auto px-4 max-w-screen-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-6xl text-center mb-8 text-[#53779c] font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {/* Contact Info Card */}
          <motion.div 
            className="p-10 bg-white rounded-2xl shadow-lg flex flex-col justify-between items-center text-center md:col-span-1"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h3 
              className="text-3xl text-[#53779c] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Get in Touch
              <p className="text-lg">Have questions? We're here to help!</p>
            </motion.h3>
            
            <div className="mt-8 space-y-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center space-x-2"
              >
                <Mail className="text-[#53779c]" />
                <p className="text-lg">contact@example.com</p>
               
              </motion.div>
              <div>
              <img src={img} alt="Contact Us" className="w-full rounded-lg" />
            </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center space-x-2"
              >
                <Phone className="text-[#53779c]" />
                <p className="text-lg">+1 234 567 890</p>
                
              </motion.div>
            </div>
          </motion.div>
         

          {/* Contact Form */}
          <motion.div 
            className="p-10 bg-white rounded-2xl shadow-lg md:col-span-2"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                icon={User}
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <InputField
                icon={Mail}
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              
              <InputField
                icon={MessageSquare}
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full p-4 text-base border-2 border-gray-200 rounded-lg transition-all duration-300 
                    focus:border-[#3b6fa6] focus:ring-2 focus:ring-[#4f80b5] focus:ring-opacity-20 outline-none 
                    min-h-[150px] resize-y hover:border-[#4f80b5] hover:shadow-lg hover:shadow-[#4f80b570]"
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-10 py-4 bg-[#3e6b9c] text-white rounded-lg text-lg font-semibold 
                  transition-all duration-300 uppercase tracking-wider hover:bg-[#4a7fc0] 
                  hover:shadow-xl hover:shadow-blue-400/50 flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </motion.button>
            </form>

            {submitStatus && <AlertMessage type={submitStatus} message={
              submitStatus === 'success' 
                ? 'Message sent successfully!' 
                : 'Failed to send message. Please try again.'
            } />}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactUs;