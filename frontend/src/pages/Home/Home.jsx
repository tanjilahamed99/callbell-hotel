import {
  PhoneCall,
  QrCode,
  ShieldCheck,
  Users,
  Server,
  Star,
  FileText,
  Globe,
  Lock,
  Zap,
  MessageCircle,
  CheckCircle,
  BarChart3,
  Smartphone,
  Headphones,
  Download,
  ExternalLink,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BannerSlider from "../../components/Slider/BannerSlider";
import { Link } from "react-router-dom";
import SubscriptionSection from "./SubscriptionSection";

const Home = () => {
  const downloadLinks = [
    {
      name: "CallBell APK",
      version: "v2.1.0",
      size: "8 MB",
      date: "Dec 2024",
      link: "https://drive.google.com/file/d/10-g5uRvR1dNBrT_7qbkhnX1rs9TVSvL7/view?usp=sharing",
      features: ["Latest Version", "Android 8.0+", "Optimized"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Slider */}
      <section className="relative overflow-hidden">
        <BannerSlider />

        {/* Hero Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-transparent to-black/30">
          <div className="text-center px-4 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Instant Calls,
              <span className="text-red-500"> Seamless</span> Connections
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Professional, secure, and crystal-clear voice communication
              powered by cutting-edge technology. Connect instantly with QR
              scanning and enjoy enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#features"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Users", icon: Users },
              { value: "50K+", label: "Calls Made", icon: PhoneCall },
              { value: "99.9%", label: "Uptime", icon: Server },
              { value: "24/7", label: "Support", icon: Headphones },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Purchase Qr Code and stick{" "}
              <span className="text-red-600">anywhere</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Your qr code will work as your virtual address Anyone can scan and
              make audio/video call
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PhoneCall,
                title: "Instant Calls",
                description:
                  "Start crystal-clear voice calls with one click, no downloads required.",
                color: "from-red-500 to-red-600",
              },
              {
                icon: QrCode,
                title: "QR Integration",
                description:
                  "Scan codes to instantly connect with users, services, or locations.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: ShieldCheck,
                title: "Military-Grade Security",
                description:
                  "End-to-end encrypted calls ensuring your conversations stay private.",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: Globe,
                title: "Global Connectivity",
                description:
                  "Connect with anyone, anywhere with our global server network.",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: MessageCircle,
                title: "Real-time Communication",
                description:
                  "Send instant messages alongside your voice calls for better collaboration.",
                color: "from-purple-500 to-pink-600",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description:
                  "Track call history, duration, and user activity with detailed insights.",
                color: "from-indigo-500 to-purple-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                />
                <div className="relative z-10">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                  {/* <div className="mt-6 pt-6 border-t border-gray-100">
                    <a
                      href="#"
                      className="inline-flex items-center text-red-600 font-semibold group-hover:text-red-700 transition-colors duration-300">
                      Learn more
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* download section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full mb-6">
              <Smartphone className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">
                Android App Download
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Download <span className="text-red-600">CallBell</span> App
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Get the latest version of CallBell app directly from Google Drive.
              Safe, secure, and easy to install.
            </p>
          </div>

          {/* Download Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-10">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {downloadLinks[0].name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Version: {downloadLinks[0].version}</span>
                      <span>•</span>
                      <span>Size: {downloadLinks[0].size}</span>
                      <span>•</span>
                      <span>Updated: {downloadLinks[0].date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {downloadLinks[0].features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      <CheckCircle className="w-3 h-3" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <a
                href="https://drive.google.com/file/d/10-g5uRvR1dNBrT_7qbkhnX1rs9TVSvL7/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full group">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-orange-500 p-0.5">
                  <div className="relative bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-1">
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg">
                            <Download className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              Download Now
                            </h4>
                            <p className="text-sm text-gray-600">
                              Direct download from Google Drive
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-red-600">
                          <span className="font-semibold">Get APK</span>
                          <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Designed for <span className="text-red-600">Everyone</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Tailored experiences for different user roles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Guest",
                description:
                  "Explore features, scan QR codes, and initiate calls without registration.",
                features: ["Basic QR Scanning", "Trial Calls", "Feature Demo"],
                gradient: "from-gray-400 to-gray-600",
              },
              {
                title: "Registered User",
                description:
                  "Full access to all features with personalized dashboard and history.",
                features: [
                  "Full Call Features",
                  "Dashboard Access",
                  "Call History",
                  "Profile Management",
                ],
                gradient: "from-red-500 to-red-700",
              },
              {
                title: "Admin",
                description:
                  "Complete control over system settings, users, and analytics.",
                features: [
                  "User Management",
                  "System Monitoring",
                  "Analytics",
                  "Settings Control",
                ],
                gradient: "from-gray-900 to-black",
              },
            ].map((role, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${role.gradient}`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 ml-4">
                      {role.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">{role.description}</p>
                  <ul className="space-y-3">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <button
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        index === 1
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}>
                      {index === 1 ? (
                        <Link to="/login">Get Started</Link>
                      ) : (
                        <Link to="/about">Learn More</Link>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
              <Smartphone className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple <span className="text-red-600">3-Step</span> Process
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Get started in minutes and experience seamless communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Register & Setup",
                description:
                  "Create your account in seconds. Verify your email and set up your profile.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                icon: QrCode,
                title: "Scan or Invite",
                description:
                  "Scan QR codes to connect instantly or invite others via shareable links.",
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                icon: PhoneCall,
                title: "Connect & Communicate",
                description:
                  "Start high-quality calls with one click. Enjoy crystal-clear audio.",
                color: "from-red-500 to-orange-500",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-4 -left-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-bold`}>
                      {step.step}
                    </div>
                  </div>
                  <div
                    className={`mt-8 p-4 rounded-xl bg-gradient-to-br ${step.color} inline-block mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-full h-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-gray-200"></div>
                      <div className="absolute right-0 w-4 h-4 bg-red-500 rounded-full transform translate-x-1/2"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center p-3 bg-red-500/20 rounded-full mb-6">
                <Server className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Enterprise-Grade{" "}
                <span className="text-red-400">Infrastructure</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Built on a robust, scalable platform with 99.9% uptime
                guarantee. Our distributed server network ensures low-latency
                connections worldwide.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Data Centers", value: "12+" },
                  { label: "Countries", value: "50+" },
                  { label: "Latency", value: "<50ms" },
                  { label: "Security", value: "TLS 1.3" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-gray-800/50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <Server className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <div className="h-2 w-16 bg-gray-600 rounded mb-1"></div>
                          <div className="h-2 w-12 bg-gray-600 rounded"></div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="h-1 w-full bg-gray-700 rounded overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-red-500 to-orange-500`}
                            style={{ width: `${70 + item * 5}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto">
            Join thousands of professionals who trust CallBell for their daily
            communication needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
              Schedule a Demo
            </button> */}
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            {[
              { icon: Lock, text: "Enterprise Security" },
              { icon: Zap, text: "Lightning Fast" },
              { icon: Globe, text: "Global Reach" },
              { icon: ShieldCheck, text: "99.9% Uptime" },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <feature.icon className="w-8 h-8 mb-2" />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SubscriptionSection />

      {/* Testimonials Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
              <Star className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-red-600">Thousands</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Product Manager",
                company: "TechCorp Inc.",
                content:
                  "CallBell has revolutionized our team communication. The QR integration alone saved us hours of setup time.",
                rating: 5,
                avatarColor: "bg-gradient-to-br from-red-100 to-red-200",
              },
              {
                name: "Michael Chen",
                role: "CTO",
                company: "StartUpXYZ",
                content:
                  "The security features give us peace of mind for confidential client calls. Enterprise-grade at startup prices.",
                rating: 5,
                avatarColor: "bg-gradient-to-br from-blue-100 to-blue-200",
              },
              {
                name: "Emma Rodriguez",
                role: "Operations Director",
                company: "GlobalConnect",
                content:
                  "Our international teams love the low latency. Finally, a solution that works seamlessly across continents.",
                rating: 5,
                avatarColor: "bg-gradient-to-br from-green-100 to-green-200",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 -right-4">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    ★ {testimonial.rating}.0
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-xl font-bold text-gray-800 mr-4`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-red-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-2xl p-12 shadow-2xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Start Your Free Trial Today
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            No credit card required. Get full access to all features for 14
            days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="px-8 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all duration-300">
                Contact Sales
              </button>
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 inline mr-2 text-green-500" />
            No setup fees • Cancel anytime • 24/7 support
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
