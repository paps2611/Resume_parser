import React, { useState } from 'react'
import { Mail, Phone, MessageSquare, CreditCard, CheckCircle, Star, Users, Award, Clock, FileText } from 'lucide-react'

export default function ConnectPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    experience: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://formspree.io/f/mqadwwya", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        alert("✅ Thank you for your interest! We will contact you within 24 hours.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          industry: "",
          experience: "",
          message: ""
        });
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("⚠️ Network error. Please check your connection and try again.");
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const services = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "ATS-Optimized Resume",
      description: "Professional resume tailored for ATS systems",
      price: "₹500"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Cover Letter",
      description: "Compelling cover letter for your applications",
      price: "₹300"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "LinkedIn Optimization",
      description: "Complete LinkedIn profile makeover",
      price: "₹400"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Interview Prep",
      description: "Mock interviews and preparation sessions",
      price: "₹600"
    }
  ]

  const features = [
    "Industry-specific templates",
    "ATS-friendly formatting",
    "Keyword optimization",
    "Professional design",
    "24-hour delivery",
    "Unlimited revisions"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Professional</span>
            <br />
            <span className="text-gray-900 dark:text-white">Resume Services</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Get your resume professionally crafted by our experts. We specialize in creating 
            ATS-friendly resumes that get you noticed by recruiters and hiring managers.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 dark:text-gray-300">Choose the service that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                <div className="text-2xl font-bold gradient-text">{service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Service Highlight */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">ATS-Friendly Resume Package</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our most popular service - a complete resume makeover optimized for all industries
              </p>
              <div className="text-4xl font-bold gradient-text mb-4">₹500</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">One-time payment • 24-hour delivery</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What's Included:</h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Process:</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Submit your current resume</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">2</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Expert analysis and optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">3</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Receive your new resume</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Experience</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive Level (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your specific requirements, target roles, or any questions you have..."
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900 dark:text-blue-100">Payment Information</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Payment of ₹500 will be collected after we review your requirements and confirm the scope of work. 
                  We accept UPI, Net Banking, and Credit/Debit cards.
                </p>
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Send Request</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Reach out to us directly for any questions or immediate assistance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600 dark:text-gray-300">pratyushpaps@gmail.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600 dark:text-gray-300">+91 9313681006</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-300">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
