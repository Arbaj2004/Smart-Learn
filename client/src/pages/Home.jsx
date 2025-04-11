import  { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart2, 
  Shield, 
  PenTool, 
  Globe,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('students');
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'faculty' || hash === 'students') {
      setActiveTab(hash);
    }
    const handleHashChange = () => {
        const newHash = window.location.hash.replace('#', '');
        if (newHash === 'faculty' || newHash === 'students') {
          setActiveTab(newHash);
        }
      };
      window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
},[]);

  const features = [
    { 
      id: 'courses', 
      icon: <BookOpen className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'Course Management', 
      description: 'Create, organize, and deliver courses with easy-to-use tools for content creation and student management.' 
    },
    { 
      id: 'enrollment', 
      icon: <Users className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'Student Enrollment', 
      description: 'Streamlined enrollment process with automated notifications and progress tracking.' 
    },
    { 
      id: 'assignments', 
      icon: <FileText className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'Assignment Tracking', 
      description: 'Manage and grade assignments, provide feedback, and track submission history.' 
    },
    { 
      id: 'ai-chatbot', 
      icon: <MessageSquare className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'AI Chatbot Support', 
      description: 'Botpress-powered chatbot that handles common queries and provides instant assistance.' 
    },
    { 
      id: 'plagiarism', 
      icon: <Shield className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'Plagiarism Detection', 
      description: 'Automatically identify potential academic integrity issues in submitted assignments.' 
    },
    { 
      id: 'collaboration', 
      icon: <PenTool className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'Real-time Collaboration', 
      description: 'Interactive tools for discussions, group projects, and peer reviews.' 
    },
    { 
      id: 'analytics', 
      icon: <BarChart2 className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'Advanced Analytics', 
      description: 'Comprehensive insights into student performance, engagement, and course effectiveness.' 
    },
    { 
      id: 'integration', 
      icon: <Globe className="w-6 h-6 mb-4 text-indigo-600" />, 
      title: 'API Integration', 
      description: 'Seamless connectivity with external educational tools and platforms.' 
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Professor of Computer Science",
      content: "SmartLearn has transformed how I teach my online courses. The course management tools and plagiarism detection have saved me countless hours.",
      avatar: "https://celebmafia.com/wp-content/uploads/2020/06/scarlett-johansson-elle-magazine-14th-annual-women-in-hollywood-event-2007-20.jpg"
    },
    {
      name: "Michael Chen",
      role: "Student, Engineering",
      content: "The AI chatbot helped me find resources and answer questions even at 2AM before my exam. Group collaboration tools made our team project so much easier!",
      avatar: "https://people.com/thmb/2Dl3BcFzccN7vA2FFTlAsBPenTA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(777x471:779x473)/Chris-Evans-Wedding-Band-101423-01-8ab8e8e451ba45aebcb3bbf716bb320f.jpg"
    },
    {
      name: "Emma Rodriguez",
      role: "Educational Technology Director",
      content: "The analytics provided by SmartLearn gave us valuable insights to improve our curriculum and teaching methods across the entire department.",
      avatar: "https://i.pinimg.com/originals/e1/3a/46/e13a46feee1b95ebf99473793e48f78e.jpg"
    }
  ];

  return (
    <div id='home' className="min-h-full bg-gray-50">
      {/* Hero Section */}
      <div id='home' className="relative bg-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Transform Your <span className="text-indigo-300">Online Education</span>
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                SmartLearn is a comprehensive learning management system built on the MERN stack, designed to enhance the educational experience for both faculty and students.
              </p>
              <div className="mt-10 flex space-x-4">
                <button className="bg-white text-indigo-600 px-8 py-3 border border-transparent rounded-md font-medium">
                  Get Started Free
                </button>
                <button className="bg-indigo-700 text-indigo-100 px-8 py-3 border border-indigo-500 rounded-md font-medium">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://i.ytimg.com/vi/Ig9Ee2XMpwU/maxresdefault.jpg" alt="SmartLearn Platform" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Features for Modern Education
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to manage courses, engage students, and analyze performance.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  {feature.icon}
                  <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* For faculty & Students Section */}
      <div className="py-20 bg-gray-50">
        <div id='student' className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id='faculty' className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              SmartLearn Works for Everyone
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Tailored experiences for both faculty and students
            </p>
          </div>

          <div   className="flex border-b border-gray-200 " >
            <button 
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === 'faculty' 
                  ? '  text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('faculty')}
            >
              For faculty
            </button>
            <button 
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === 'students' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('students')}
            >
              For Students
            </button>
          </div>

          <div  className="mt-12">
            {activeTab === 'faculty' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Empower Your Teaching</h3>
                  <ul className="mt-8 space-y-5">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Create and manage courses with intuitive tools</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Track student progress and engagement</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Detect plagiarism in submitted assignments</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Gain insights through detailed analytics</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Streamline grading and feedback processes</p>
                    </li>
                  </ul>
                  <div className="mt-10">
                    <button className="flex items-center text-indigo-600 font-medium">
                      Learn more about educator features
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img src="https://tutorasap.es/wp-content/uploads/2013/02/Pretty-teacher-smiling-elkgroveins-com.jpg" alt="Educator Dashboard" className="w-full" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img src="https://postpear.com/wp-content/uploads/2022/03/Digital-Marketing-2048x1075.jpg" alt="Student Dashboard" className="w-full" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Enhance Your Learning</h3>
                  <ul className="mt-8 space-y-5">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Access course materials anytime, anywhere</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Submit assignments and receive timely feedback</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Collaborate with peers on group projects</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Get immediate assistance from the AI chatbot</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-lg text-gray-700">Track your progress and performance analytics</p>
                    </li>
                  </ul>
                  <div className="mt-10">
                    <button className="flex items-center text-indigo-600 font-medium">
                      Learn more about student features
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MERN Stack Section */}
      <div className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Built on Modern Technology
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              SmartLearn is powered by the MERN stack for maximum performance and reliability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md">
                <img src="https://www.heise.de/download/media/mongodb-82926/mongodb-logo_1-1-30.png" alt="MongoDB" className="h-16 w-16" />
              </div>
              <span className="mt-4 font-medium text-gray-900">MongoDB</span>
              <span className="text-sm text-gray-500">Database</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md">
                <img src="https://adware-technologies.s3.amazonaws.com/uploads/technology/thumbnail/20/express-js.png" alt="Express.js" className="h-16 w-16" />
              </div>
              <span className="mt-4 font-medium text-gray-900">Express.js</span>
              <span className="text-sm text-gray-500">Backend Framework</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md">
                <img src="https://rat.in.ua/wp-content/uploads/2015/12/5525-React.js.png" alt="React" className="h-16 w-16" />
              </div>
              <span className="mt-4 font-medium text-gray-900">React</span>
              <span className="text-sm text-gray-500">Frontend Library</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md">
                <img src="https://logodix.com/logo/1764875.png" alt="Node.js" className="h-16 w-16" />
              </div>
              <span className="mt-4 font-medium text-gray-900">Node.js</span>
              <span className="text-sm text-gray-500">Runtime Environment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Hear from faculty and students using SmartLearn
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your teaching?</span>
            <span className="block text-indigo-200">Start using SmartLearn today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button className="bg-white text-indigo-600 px-6 py-3 border border-transparent rounded-md font-medium">
                Get Started
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button className="bg-indigo-600 text-white px-6 py-3 border border-indigo-500 rounded-md font-medium">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">API</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-base text-gray-400">
              &copy; 2025 SmartLearn. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;