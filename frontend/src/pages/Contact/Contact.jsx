import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { BASE_URL } from "../../config/constant";
import Swal from "sweetalert2";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  Users,
  Shield,
} from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(BASE_URL + "/users/contact", form);
      if (data.success) {
        setForm({ name: "", email: "", message: "" });
        Swal.fire({
          title: "Message Sent!",
          text: "We'll get back to you within 24 hours.",
          icon: "success",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "Great!",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to send message. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Office",
      details: "Tara Tower, Polytechnic Crossing",
      subdetails: "Jaunpur (UP) 222002, India",
      color: "from-red-600 to-red-700",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91-8299065387",
      subdetails: "Mon-Fri 9:00 AM - 6:00 PM",
      color: "from-orange-600 to-red-600",
    },
    {
      icon: Mail,
      title: "Email",
      details: "callbellwala@gmail.com",
      subdetails: "We reply within 24 hours",
      color: "from-blue-600 to-purple-600",
    },
    {
      icon: Clock,
      title: "Support Hours",
      details: "24/7 Technical Support",
      subdetails: "Enterprise customers",
      color: "from-green-600 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-red-700/5 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-600/20 rounded-full mb-6">
            <MessageSquare className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-red-500">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about CallBell? We're here to help. Reach out to our
            team and we'll respond as quickly as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Contact <span className="text-red-600">Information</span>
                </h2>
                <p className="text-gray-600">
                  Feel free to reach out to us through any of these channels.
                  Our team is ready to assist you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-900 font-semibold">
                          {info.details}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {info.subdetails}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Features */}
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Why Contact Us?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Shield className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">
                      Enterprise security inquiries
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">Team/Enterprise plans</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <MessageSquare className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">Technical support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Send us a <span className="text-red-600">Message</span>
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and our team will get back to you
                      within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        placeholder="Tell us how we can help you..."
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-700 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 active:scale-95">
                        <span className="relative z-10 flex items-center justify-center">
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-3" />
                              Send Message
                            </>
                          )}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </button>
                    </div>

                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-500">
                        By submitting this form, you agree to our{" "}
                        <a
                          href="/privacy"
                          className="text-red-600 hover:text-red-700 font-medium">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </form>
                </div>

                {/* Form Footer */}
                <div className="bg-gradient-to-r from-red-50 to-white border-t border-red-100 p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Response Time
                        </p>
                        <p className="text-xs text-gray-500">
                          Typically within 24 hours
                        </p>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-sm text-gray-500">
                        Need immediate assistance?
                      </p>
                      <a
                        href="tel:+918299065387"
                        className="text-red-600 hover:text-red-700 font-semibold">
                        Call +91-8299065387
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked{" "}
                  <span className="text-red-600">Questions</span>
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      question: "What's your typical response time?",
                      answer:
                        "We aim to respond to all inquiries within 24 hours during business days. Enterprise customers receive priority support.",
                    },
                    {
                      question: "Do you offer enterprise solutions?",
                      answer:
                        "Yes! We provide custom enterprise plans with additional security features, dedicated support, and volume discounts.",
                    },
                    {
                      question: "Can I schedule a demo?",
                      answer:
                        "Absolutely! Contact us to schedule a personalized demo of our platform tailored to your specific needs.",
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-red-300 transition-colors duration-300">
                      <h4 className="font-bold text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map/CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Visit Our <span className="text-red-500">Office</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Located in the heart of Jaunpur, our office is ready to welcome you
          </p>

          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Address</h3>
                <p className="text-gray-300">
                  Tara Tower, Polytechnic Crossing
                </p>
                <p className="text-gray-400 text-sm">Jaunpur (UP) 222002</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Hours</h3>
                <p className="text-gray-300">Monday - Friday</p>
                <p className="text-gray-400 text-sm">9:00 AM - 6:00 PM IST</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-red-700 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Emergency</h3>
                <p className="text-gray-300">+91-8299065387</p>
                <p className="text-gray-400 text-sm">24/7 for enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
