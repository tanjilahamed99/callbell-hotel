import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Globe,
  Lock,
  Download,
  Printer,
  BookOpen,
} from "lucide-react";

const Terms = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedSections, setExpandedSections] = useState(["1", "2"]);

  const toggleSection = (id) => {
    setExpandedSections((prev) =>
      prev.includes(id)
        ? prev.filter((sectionId) => sectionId !== id)
        : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };


  const termsSections = [
    {
      id: "1",
      title: "1. Acceptance of Terms",
      content: `By accessing and using the CallBell platform ("Service"), you accept and agree to be bound by the terms and conditions outlined in this agreement. If you disagree with any part of these terms, you may not access the Service.`,
    },
    {
      id: "2",
      title: "2. Service Description",
      content: `CallBell provides video communication services, including but not limited to video calls, chat functionality, and file sharing. The Service is provided "as is" and is subject to change or discontinuation at our discretion.`,
    },
    {
      id: "3",
      title: "3. User Accounts",
      content: `To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.`,
    },
    {
      id: "4",
      title: "4. Privacy Policy",
      content: `Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, and disclose information that pertains to your privacy. Please review our Privacy Policy before using the Service.`,
    },
    {
      id: "5",
      title: "5. Acceptable Use",
      content: `You agree not to use the Service:
      • For any unlawful purpose
      • To harass, abuse, or harm others
      • To infringe upon intellectual property rights
      • To transmit viruses or malicious code
      • To interfere with the Service's operation`,
    },
    {
      id: "6",
      title: "6. Intellectual Property",
      content: `The Service and its original content, features, and functionality are owned by CallBell and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`,
    },
    {
      id: "7",
      title: "7. Limitation of Liability",
      content: `In no event shall CallBell, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.`,
    },
    {
      id: "8",
      title: "8. Termination",
      content: `We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.`,
    },
    {
      id: "9",
      title: "9. Changes to Terms",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.`,
    },
    {
      id: "10",
      title: "10. Governing Law",
      content: `These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.`,
    },
  ];

  const quickLinks = [
    {
      id: "overview",
      label: "Overview",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "terms",
      label: "Full Terms",
      icon: <FileText className="w-4 h-4" />,
    },
    { id: "contact", label: "Contact", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-red-50">
                <Shield className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Last updated:{" "}
              <span className="font-semibold text-red-600">
                December 15, 2024
              </span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Version 2.1</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Legal Document</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Quick Links */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-red-600" />
                    Quick Navigation
                  </h3>
                  <nav className="space-y-2">
                    {quickLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => setActiveSection(link.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          activeSection === link.id
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}>
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="space-y-3">
                      <button
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                        <Printer className="w-4 h-4" />
                        Print Terms
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="mt-6 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">
                        Important Notice
                      </h4>
                      <p className="text-sm text-red-700">
                        These terms constitute a legal agreement. Please read
                        them carefully before using our services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Content Tabs */}
                {activeSection === "overview" && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Overview
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        These Terms of Service govern your use of the CallBell
                        platform and services. They outline your rights and
                        responsibilities as a user and our commitments to you.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Your Rights
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span>
                              Access to our video communication services
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span>Data privacy and protection</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span>24/7 customer support</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          Your Responsibilities
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span>Comply with acceptable use policies</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span>Maintain account security</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span>Respect intellectual property rights</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Key Points
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Legal Agreement
                            </h4>
                            <p className="text-sm text-gray-600">
                              By using CallBell, you agree to these terms and
                              our Privacy Policy.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Shield className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Privacy First
                            </h4>
                            <p className="text-sm text-gray-600">
                              We prioritize your privacy and data security in
                              all our services.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "terms" && (
                  <div className="p-8" id="terms-content">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Full Terms of Service
                      </h2>
                      <p className="text-gray-600">
                        Please read these terms carefully before using our
                        services.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {termsSections.map((section) => (
                        <div
                          key={section.id}
                          className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <span className="text-red-600 font-bold">
                                  {section.id}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {section.title}
                              </h3>
                            </div>
                            {expandedSections.includes(section.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </button>

                          {expandedSections.includes(section.id) && (
                            <div className="p-6 pt-0">
                              <div className="pl-14">
                                <p className="text-gray-600 leading-relaxed">
                                  {section.content}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "contact" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Legal Inquiries
                          </h3>
                          <p className="text-gray-600">
                            For legal inquiries regarding these Terms of
                            Service, please contact:
                          </p>
                          <div className="mt-4 space-y-2">
                            <p className="text-gray-700">
                              <span className="font-medium">Email:</span>{" "}
                              legal@callbell.com
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Hours:</span>{" "}
                              Monday-Friday, 9AM-6PM IST
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Response Time
                          </h4>
                          <p className="text-gray-600 text-sm">
                            We aim to respond to all legal inquiries within 2-3
                            business days.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Need Help?
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg">
                              <FileText className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Documentation
                              </h4>
                              <p className="text-sm text-gray-600">
                                Read our comprehensive documentation for
                                detailed information.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="p-2 bg-white rounded-lg">
                              <User className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Support Center
                              </h4>
                              <p className="text-sm text-gray-600">
                                Visit our support center for FAQs and
                                troubleshooting guides.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Last Updated */}
              <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: December 15, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Effective immediately upon posting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
