import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  Cookie,
  FileText,
  CheckCircle,
  AlertCircle,
  Mail,
  Globe,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const lastUpdated = "December 15, 2024";

  const privacySections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content:
        "We collect information you provide directly, such as when you create an account, use our services, or contact us for support. This includes your name, email address, phone number, and call history.",
      points: [
        "Account information (name, email, phone)",
        "Call metadata (duration, timestamps, participants)",
        "Device information and IP addresses",
        "Usage data and service logs",
      ],
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content:
        "Your information helps us provide, maintain, and improve our services, develop new features, and protect our users.",
      points: [
        "Provide and maintain CallBell services",
        "Process and complete transactions",
        "Send technical notices and updates",
        "Respond to your comments and questions",
        "Monitor and analyze trends and usage",
        "Personalize your experience",
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content:
        "We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, or destruction.",
      points: [
        "End-to-end encryption for all calls",
        "Regular security audits and testing",
        "Secure data storage with encryption at rest",
        "Access controls and authentication",
        "Incident response procedures",
      ],
    },
    {
      icon: Users,
      title: "Information Sharing",
      content:
        "We do not sell your personal information. We only share information in limited circumstances as described below.",
      points: [
        "With your explicit consent",
        "For legal compliance and protection",
        "With service providers under confidentiality",
        "During business transfers or mergers",
        "Aggregated or anonymized data",
      ],
    },
    {
      icon: Globe,
      title: "International Data Transfers",
      content:
        "Your information may be transferred to and processed in countries other than your own, with appropriate safeguards in place.",
      points: [
        "Data processed in multiple jurisdictions",
        "Standard contractual clauses for EU transfers",
        "Adequacy decisions where applicable",
        "Transparent cross-border data flows",
      ],
    },
    {
      icon: Cookie,
      title: "Cookies and Tracking",
      content:
        "We use cookies and similar technologies to enhance your experience, analyze service usage, and assist in marketing efforts.",
      points: [
        "Essential cookies for service functionality",
        "Analytics cookies for improvement",
        "Preferences cookies for personalization",
        "Option to manage cookie preferences",
      ],
    },
  ];

  const rights = [
    { icon: CheckCircle, text: "Access your personal data" },
    { icon: CheckCircle, text: "Correct inaccurate data" },
    { icon: CheckCircle, text: "Request data deletion" },
    { icon: CheckCircle, text: "Object to data processing" },
    { icon: CheckCircle, text: "Data portability" },
    { icon: CheckCircle, text: "Withdraw consent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-red-700/5 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-600/20 rounded-full mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Privacy <span className="text-red-500">Policy</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Your privacy is our priority. This policy explains how we collect,
            use, and protect your information when you use CallBell services.
          </p>
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm sm:text-base">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Introduction */}
            <div className="mb-12 sm:mb-16">
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 sm:p-8 border border-red-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Our Commitment
                </h2>
                <p className="text-gray-600 text-base sm:text-lg mb-4">
                  At CallBell, we believe that privacy is a fundamental right.
                  We are committed to being transparent about our data practices
                  and providing you with control over your personal information.
                </p>
                <p className="text-gray-600 text-base sm:text-lg">
                  This Privacy Policy applies to all services offered by
                  CallBell, including our web platform, mobile applications, and
                  any related services (collectively, the "Services").
                </p>
              </div>
            </div>

            {/* Privacy Sections */}
            <div className="space-y-8 sm:space-y-12 mb-12 sm:mb-16">
              {privacySections.map((section, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <section.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-base sm:text-lg">
                          {section.content}
                        </p>
                        <ul className="space-y-2">
                          {section.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start">
                              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-red-600" />
                              </div>
                              <span className="text-gray-700 text-sm sm:text-base">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Your Rights */}
            <div className="mb-12 sm:mb-16">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Your <span className="text-red-600">Privacy Rights</span>
                </h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
                  You have certain rights regarding your personal information.
                  You can exercise these rights at any time by contacting us.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {rights.map((right, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 sm:p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-300">
                      <right.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-800 text-sm sm:text-base font-medium">
                        {right.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 sm:p-8 border border-red-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Contact Us
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  If you have questions about this Privacy Policy or our data
                  practices, please contact our Data Protection Officer.
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-red-600 font-medium">
                      privacy@callbell.com
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Mailing Address
                    </p>
                    <p className="text-gray-800">
                      CallBell Privacy Team
                      <br />
                      Tara Tower, Polytechnic Crossing
                      <br />
                      Jaunpur (UP) 222002, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Updates */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Policy Updates
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "last updated" date.
                </p>
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800">
                        We encourage you to review this Privacy Policy
                        periodically for any changes. Your continued use of our
                        Services after any modification constitutes acceptance
                        of the updated Privacy Policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-12 sm:mt-16">
              <div className="bg-gray-900 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  Legal Disclaimer
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  This Privacy Policy is provided for informational purposes
                  only and does not constitute legal advice. The use of CallBell
                  services is subject to our Terms of Service, which contain
                  important provisions regarding dispute resolution, liability
                  limitations, and other legal matters. By using our services,
                  you acknowledge that you have read, understood, and agree to
                  be bound by both this Privacy Policy and our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Your Privacy Matters
          </h2>
          <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto">
            We're committed to protecting your data and providing transparent
            privacy practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/contact"}>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300">
                Contact Privacy Team
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
