import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  Target,
  Users,
  Shield,
  Globe,
  Zap,
  Heart,
  Award,
  TrendingUp,
  Clock,
  PhoneCall,
  MessageSquare,
  BarChart,
  Cpu,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      expertise: "Telecom Infrastructure",
      avatar: "/api/placeholder/100/100",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      expertise: "Real-time Communication",
      avatar: "/api/placeholder/100/100",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Security",
      expertise: "Encryption Systems",
      avatar: "/api/placeholder/100/100",
    },
    {
      name: "Priya Sharma",
      role: "Product Lead",
      expertise: "User Experience",
      avatar: "/api/placeholder/100/100",
    },
  ];

  const milestones = [
    {
      year: "2022",
      title: "Founded",
      description: "CallBell was born to revolutionize instant communication",
    },
    {
      year: "2023",
      title: "Beta Launch",
      description: "First version released with basic call features",
    },
    {
      year: "2023",
      title: "10K Users",
      description: "Reached milestone of 10,000 active users",
    },
    {
      year: "2024",
      title: "QR Integration",
      description: "Introduced QR scanning for instant connections",
    },
    {
      year: "2024",
      title: "Enterprise Launch",
      description: "Released enterprise-grade security features",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "End-to-end encryption is non-negotiable for us",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant connections with minimal latency",
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Designed with real user needs in mind",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting people across borders seamlessly",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-red-700/5 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-600/20 rounded-full mb-6">
            <Target className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Redefining <span className="text-red-500">Instant</span>{" "}
            Communication
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            At CallBell, we're on a mission to make professional communication
            faster, more secure, and more accessible than ever before.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center p-3 bg-red-50 rounded-full mb-6">
                <Sparkles className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-red-600">Story</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Founded in 2022, CallBell emerged from a simple observation:
                professional communication was becoming increasingly complex
                while losing the instant, personal touch that made it effective.
              </p>
              <p className="text-gray-600 text-lg mb-8">
                We set out to build a platform that combines enterprise-grade
                security with the simplicity of instant connection. Today, we
                serve thousands of users worldwide who trust us for their
                critical communications.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border border-red-100">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    50K+
                  </div>
                  <div className="text-gray-700">Active Users</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border border-red-100">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-700">Support Available</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-10" />
                <div className="relative p-8 bg-gradient-to-br from-gray-50 to-white">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                        <PhoneCall className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Instant Connection
                        </h3>
                        <p className="text-sm text-gray-600">
                          One-click calls, zero delays
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Real-time Chat
                        </h3>
                        <p className="text-sm text-gray-600">
                          Seamless text alongside calls
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                        <BarChart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Smart Analytics
                        </h3>
                        <p className="text-sm text-gray-600">
                          Insights to improve communication
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center p-3 bg-red-50 rounded-full mb-6">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-red-600">Mission</span> & Vision
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We believe that communication should be instant, secure, and
              accessible to everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission</h3>
              <p className="text-gray-600">
                To revolutionize how professionals connect by providing instant,
                secure, and intuitive communication tools that work seamlessly
                across all devices and platforms.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision</h3>
              <p className="text-gray-600">
                To become the world's most trusted platform for professional
                communication, connecting millions of users with unprecedented
                speed, security, and simplicity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center p-3 bg-red-50 rounded-full mb-6">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-red-600">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-red-200">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      {/* Milestones Timeline - Simplified Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center p-2 sm:p-3 bg-red-50 rounded-full mb-4 sm:mb-6">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our <span className="text-red-600">Journey</span>
            </h2>
          </div>

          {/* Mobile Vertical Timeline (Single Column) */}
          <div className="md:hidden">
            <div className="relative pl-10">
              {/* Vertical line for mobile */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 to-red-700" />

              {milestones.map((milestone, index) => (
                <div key={index} className="relative mb-8 last:mb-0">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-2 w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 border-2 border-white shadow-lg -translate-x-1/2" />

                  {/* Content card */}
                  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-3">
                      <div className="text-xl font-bold text-red-600 mr-4">
                        {milestone.year}
                      </div>
                      <div className="w-8 h-0.5 bg-gray-200"></div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Horizontal Timeline (Two Columns) */}
          <div className="hidden md:block relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-red-600 to-red-700" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-red-700 border-4 border-white shadow-lg z-10" />

                  {/* Content card */}
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "pr-12 text-right" : "pl-12"
                    }`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center p-3 bg-red-50 rounded-full mb-6">
              <Cpu className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cutting-Edge <span className="text-red-600">Technology</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Powered by the latest advancements in real-time communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600">
                Military-grade security for all communications
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Low Latency
              </h3>
              <p className="text-gray-600">
                Global server network for instant connections
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-6 flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                99.9% Uptime
              </h3>
              <p className="text-gray-600">
                Reliable service with enterprise SLA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center p-3 bg-red-50 rounded-full mb-6">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-red-600">Team</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Passionate experts dedicated to transforming communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-red-200">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-700 mx-auto flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-10 w-8 h-8 rounded-full bg-green-500 border-4 border-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-semibold text-center mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-center text-sm">
                    {member.expertise}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Thousands of Happy Users
          </h2>
          <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto">
            Experience the future of professional communication today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/login"}>
              <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
