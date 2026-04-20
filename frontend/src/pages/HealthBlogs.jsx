import React from "react";
import { Link } from "react-router-dom";

const healthBlogs = [
  {
    id: 1,
    title: "Understanding Mental Health",
    category: "Mental Health",
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&auto=format&fit=crop",
    summary: "Explore the importance of mental health and ways to maintain psychological well-being in today's fast-paced world.",
    link: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    source: "World Health Organization"
  },
  {
    id: 2,
    title: "Benefits of Regular Exercise",
    category: "Physical Health",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop",
    summary: "Learn about how regular physical activity can improve your health, boost mood, and prevent chronic diseases.",
    link: "https://www.cdc.gov/physicalactivity/basics/pa-health/index.htm",
    source: "Centers for Disease Control and Prevention"
  },
  {
    id: 3,
    title: "Nutrition and Diet Tips",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    summary: "Essential guidelines for maintaining a balanced diet and making healthy food choices for optimal health.",
    link: "https://www.nih.gov/health-information/diet-nutrition",
    source: "National Institutes of Health"
  },
  {
    id: 4,
    title: "Sleep and Recovery",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop",
    summary: "Understanding the importance of quality sleep and its impact on physical and mental recovery.",
    link: "https://www.sleepfoundation.org/sleep-hygiene",
    source: "Sleep Foundation"
  },
  {
    id: 5,
    title: "Stress Management",
    category: "Mental Health",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    summary: "Effective techniques and strategies to manage stress and maintain emotional balance in daily life.",
    link: "https://www.nimh.nih.gov/health/publications/stress",
    source: "National Institute of Mental Health"
  },
  {
    id: 6,
    title: "Heart Health Essentials",
    category: "Physical Health",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop",
    summary: "Key factors in maintaining cardiovascular health and preventing heart disease through lifestyle choices.",
    link: "https://www.heart.org/en/health-topics",
    source: "American Heart Association"
  }
];

const HealthBlogs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-black-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-8 mb-12 dark:text-white-1 whitespace-nowrap">
          Health & Wellness Blogs
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {healthBlogs.map((blog) => (
            <div 
              key={blog.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105 dark:bg-black-7"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="p-6">
                <span className="text-sm font-semibold text-blue-5 dark:text-blue-3">
                  {blog.category}
                </span>
                <h2 className="text-xl font-bold text-blue-8 mt-2 mb-4 dark:text-white-1">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 dark:text-gray-300">
                  {blog.summary}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Source: {blog.source}
                  </span>
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-3 text-white rounded hover:bg-blue-5 transition-colors duration-300 dark:bg-blue-24 dark:hover:bg-blue-31"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthBlogs; 