import React from 'react';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Vitamins for Boosting Immunity",
      excerpt: "Discover the top vitamins and minerals you need to keep your immune system strong all year round.",
      date: "Oct 24, 2023",
      category: "Health Tips",
      image: "https://images.unsplash.com/photo-1584308666744-24d5e47854a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Understanding Generic vs Brand Name Medicines",
      excerpt: "Are generic medicines just as effective as their brand-name counterparts? We break down the differences and facts.",
      date: "Nov 02, 2023",
      category: "Pharmacy Guide",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Managing Chronic Pain: Safe Medication Practices",
      excerpt: "Learn how to effectively and safely manage chronic pain with the correct use of prescribed medications.",
      date: "Nov 15, 2023",
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Our <span className="text-primary">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest health tips, medical news, and pharmacy insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary">
                  {post.category}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <p className="text-gray-500 text-sm mb-3 font-medium">{post.date}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-primary transition cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                <button className="self-start text-primary font-bold hover:text-sky-700 transition flex items-center gap-1 group/btn">
                  Read More 
                  <span className="transform group-hover/btn:translate-x-1 transition">-&gt;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
