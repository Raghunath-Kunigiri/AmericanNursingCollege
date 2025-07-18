import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, Award, TrendingUp, Building, Heart } from "lucide-react";

const stats = [
  {
    icon: GraduationCap,
    number: 36,
    suffix: "+",
    label: "Years of Excellence",
    description: "Established in 1987",
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    icon: Users,
    number: 3240,
    suffix: "+",
    label: "Successful Alumni",
    description: "Working globally",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    icon: TrendingUp,
    number: 99,
    suffix: "%",
    label: "Placement Rate",
    description: "Industry leading",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    icon: Award,
    number: 25,
    suffix: "+",
    label: "Expert Faculty",
    description: "Experienced professionals",
    color: "text-violet-600",
    bgColor: "bg-violet-100"
  },
  {
    icon: Building,
    number: 6,
    suffix: "",
    label: "Modern Facilities",
    description: "State-of-the-art labs",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100"
  },
  {
    icon: Heart,
    number: 6,
    suffix: "",
    label: "Programs",
    description: "Nursing specializations",
    color: "text-rose-600",
    bgColor: "bg-rose-100"
  }
];

function CounterAnimation({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function StatsSection() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Excellence in
            <span className="text-blue-600"> Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our commitment to healthcare education excellence is reflected in our achievements and the success of our graduates.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>

                {/* Number */}
                <div className="mb-4">
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                    {inView ? (
                      <CounterAnimation end={stat.number} suffix={stat.suffix} />
                    ) : (
                      `0${stat.suffix}`
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</h3>
                  <p className="text-gray-600">{stat.description}</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gray-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gray-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 bg-blue-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose American College of Nursing?
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold mb-2">INC Accredited</div>
                <p className="text-blue-100">Indian Nursing Council</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">Industry Partnerships</div>
                <p className="text-blue-100">Direct placement in top hospitals nationwide</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">Modern Curriculum</div>
                <p className="text-blue-100">Updated with latest healthcare practices</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}