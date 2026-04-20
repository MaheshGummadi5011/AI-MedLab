import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import httpClient from "../../httpClient";
import patientMale from "../../assets/patient-male.png";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await httpClient.get("/website_feedback");
        let data = response.data;

        if (!data.length) {
          throw new Error("Testimonials not available");
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }

        const sortedData = data.sort((a, b) => b.rating - a.rating);
        setTestimonials([...sortedData]);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials([
          {
            username: "Sophia White",
            type: "Assistant Backend Developer",
            comments:
              "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatu",
            rating: 4,
            feedbackid: 1,
          },
          {
            username: "Scarlett Brown",
            type: "Chief Executive Officer",
            comments:
              "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, to",
            rating: 5,
            feedbackid: 2,
          },
          {
            username: "Jacob Moore",
            type: "Senior Developer",
            comments:
              "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur ma",
            rating: 4,
            feedbackid: 3,
          },
        ]);
      }
    };

    fetchTestimonials();
    const interval = setInterval(fetchTestimonials, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const slideInterval = setInterval(() => {
      setPosition((prev) => {
        const next = prev - 0.2;
        const resetThreshold = -(testimonials.length / 4) * 100; // Half the list

        if (next <= resetThreshold) {
          return 0; // Seamless reset
        }

        return next;
      });
    }, 50);

    return () => clearInterval(slideInterval);
  }, [testimonials]);

  if (testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white-1 dark:bg-black-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-300 dark:border-blue-33"></div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50 dark:bg-gradient-to-b dark:from-black-8 dark:to-black-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-3 dark:bg-orange-900/30 dark:text-orange-300">Client Feedback</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-yellow-1 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Don't just take our word for it. Hear from patients who have experienced our services
          </p>
        </div>
        
        {/* Quote mark decoration */}
        <div className="relative">
          <div className="absolute left-4 top-8 opacity-10 dark:opacity-5">
            <svg className="w-24 h-24 text-blue-700" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 8c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10l-.1-1c-.5-7.4-5.8-13.4-13-14.9v6.5c1.2.3 2.3.8 3.3 1.5.7.5 1.3 1.1 1.8 1.8.6.8.9 1.7.9 2.7.1 1.3-.3 2.6-1.2 3.5-.8 1-2 1.5-3.8 1.5-1.3 0-2.5-.4-3.4-1.2-1-.8-1.5-2.1-1.5-3.5 0-1.5.5-2.7 1.6-3.5 1-.8 2.2-1.3 3.5-1.3h1.9V8zm12 0c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10l-.1-1c-.5-7.4-5.8-13.4-13-14.9v6.5c1.2.3 2.3.8 3.3 1.5.7.5 1.3 1.1 1.8 1.8.6.8.9 1.7.9 2.7.1 1.3-.3 2.6-1.2 3.5-.8 1-2 1.5-3.8 1.5-1.3 0-2.5-.4-3.4-1.2-1-.8-1.5-2.1-1.5-3.5 0-1.5.5-2.7 1.6-3.5 1-.8 2.2-1.3 3.5-1.3h1.9V8z" />
            </svg>
          </div>

          {/* Carousel container */}
          <div className="relative overflow-hidden">
            {/* Add navigation controls */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10 hidden md:block">
              <button 
                onClick={() => setPosition(prev => Math.min(prev + 20, 0))}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-blue-700 shadow-md dark:bg-blue-900/50 dark:text-white dark:hover:bg-blue-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
            </div>
            
            <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10 hidden md:block">
              <button 
                onClick={() => setPosition(prev => prev - 20)}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-blue-700 shadow-md dark:bg-blue-900/50 dark:text-white dark:hover:bg-blue-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            {/* Testimonial cards */}
            <div
              className={`flex justify-${
                testimonials.length <= 3 ? "center" : "start"
              } gap-6 transition-transform ${
                position === 0 ? "" : "duration-200 ease-linear"
              }`}
              style={{ transform: `translateX(${position}%)` }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/3 flex-shrink-0 max-w-[380px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 dark:bg-black-2 dark:border dark:border-blue-900/20"
                >
                  <div className="p-6">
                    {/* Testimonial header */}
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900">
                        <img
                          src={testimonial.profile_picture || patientMale}
                          alt="user profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-33">
                          {testimonial.username ? testimonial.username : "Anonymous"}
                        </h3>
                        <p className="text-gray-500 text-sm dark:text-blue-33/70">
                          {testimonial.feedback_type || "Patient"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    
                    {/* Quote icon */}
                    <div className="mb-4 text-blue-500/20 dark:text-blue-400/20">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    
                    {/* Comment */}
                    <p className="text-gray-600 mb-6 leading-relaxed dark:text-white-1">
                      {testimonial.comments}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center mt-8 gap-2">
          <button 
            onClick={() => setPosition(0)} 
            className={`w-2.5 h-2.5 rounded-full ${position > -20 ? 'bg-blue-600' : 'bg-blue-200'} transition-colors dark:bg-blue-700`}
          ></button>
          <button 
            onClick={() => setPosition(-33)}
            className={`w-2.5 h-2.5 rounded-full ${position <= -20 && position > -50 ? 'bg-blue-600' : 'bg-blue-200'} transition-colors dark:bg-blue-700`}
          ></button>
          <button
            onClick={() => setPosition(-66)}
            className={`w-2.5 h-2.5 rounded-full ${position <= -50 ? 'bg-blue-600' : 'bg-blue-200'} transition-colors dark:bg-blue-700`}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;