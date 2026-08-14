import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import Swal from "sweetalert2";
import {
  FileText,
  Scale,
  Save,
  RefreshCw,
  Eye,
  Code,
  AlertCircle,
  CheckCircle,
  Edit2,
  Globe,
  Type,
  Upload,
  Shield,
  Lock,
  ClipboardCheck,
  History,
  BookOpen,
  ChevronRight
} from "lucide-react";

const AdminTerms = () => {
  const [termsInfo, setTermsInfo] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const { user } = useCall();
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState("editor");

  useEffect(() => {
    if (termsInfo !== originalContent) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
    setCharCount(termsInfo.length);
  }, [termsInfo, originalContent]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedContent = e.target.terms.value;
    
    try {
      setLoading(true);
      const { data } = await addNewWebsiteData(user.id, user.email, {
        termsAndCondition: updatedContent,
      });
      if (data.success) {
        setRefetch(!refetch);
        setOriginalContent(updatedContent);
        setHasChanges(false);
        // Add to history
        setHistory(prev => [{
          timestamp: new Date().toISOString(),
          content: updatedContent.substring(0, 100) + '...',
          version: prev.length + 1
        }, ...prev.slice(0, 4)]);
        
        Swal.fire({
          title: "Success!",
          text: "Terms & Conditions updated successfully.",
          icon: "success",
          confirmButtonColor: "#dc2626",
          background: "#ffffff",
          color: "#1f2937",
          showConfirmButton: true,
          timer: 3000,
          customClass: {
            popup: 'animate__animated animate__fadeInDown'
          }
        });
      }
    } catch (error) {
      console.error("Error updating terms content:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update terms content. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTermsInfo = async () => {
      try {
        const { data } = await getWebsiteData();
        const termsContent = data?.data?.termsAndCondition || "";
        setTermsInfo(termsContent);
        setOriginalContent(termsContent);
        
        // Initialize history
        setHistory([{
          timestamp: new Date().toISOString(),
          content: termsContent.substring(0, 100) + '...',
          version: 1
        }]);
      } catch (err) {
        console.error("Error fetching terms info:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to load terms content. Please refresh the page.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    };
    fetchTermsInfo();
  }, [refetch]);

  const handleReset = () => {
    Swal.fire({
      title: "Reset Changes?",
      text: "Are you sure you want to discard all changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setTermsInfo(originalContent);
        setHasChanges(false);
      }
    });
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const templateSections = [
    {
      title: "Introduction",
      template: `<h2>Introduction</h2>
<p>Welcome to our platform. These Terms and Conditions govern your use of our services.</p>`
    },
    {
      title: "User Responsibilities",
      template: `<h2>User Responsibilities</h2>
<ul>
  <li>Provide accurate information</li>
  <li>Maintain account security</li>
  <li>Comply with applicable laws</li>
</ul>`
    },
    {
      title: "Privacy Policy",
      template: `<h2>Privacy Policy</h2>
<p>We respect your privacy. Our privacy policy explains how we collect and use your information.</p>`
    },
    {
      title: "Termination",
      template: `<h2>Termination</h2>
<p>We reserve the right to terminate accounts that violate these terms.</p>`
    }
  ];

  const insertTemplate = (template) => {
    setTermsInfo(prev => prev + "\n\n" + template);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-red-50">
              <Scale className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Terms & Conditions Editor
              </h1>
              <p className="text-gray-600 mt-1">
                Manage legal terms, conditions, and policies
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                Navigation
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleSectionChange("editor")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeSection === "editor"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Edit2 className="w-4 h-4" />
                    <span className="font-medium">Editor</span>
                  </div>
                  {activeSection === "editor" && <ChevronRight className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => handleSectionChange("templates")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeSection === "templates"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">Templates</span>
                  </div>
                  {activeSection === "templates" && <ChevronRight className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => handleSectionChange("history")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeSection === "history"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <History className="w-4 h-4" />
                    <span className="font-medium">History</span>
                  </div>
                  {activeSection === "history" && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-red-600" />
                Document Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Character Count</span>
                  <span className="text-2xl font-bold text-gray-900">{charCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Word Count</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {termsInfo.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sections</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {termsInfo.split('<h2>').length - 1}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className={hasChanges ? 'text-yellow-600' : 'text-green-600'}>
                      {hasChanges ? 'Unsaved Changes' : 'Saved'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Legal Tips
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Include clear user responsibilities</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Define acceptable use policies</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Specify dispute resolution methods</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Include limitation of liability</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeSection === "editor" && (
              <form onSubmit={handleUpdate} className="h-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                  {/* Editor Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                          <Scale className="w-5 h-5 text-red-600" />
                          Terms & Conditions Content
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Edit legal terms and conditions for your platform
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasChanges && (
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full border border-yellow-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Unsaved Changes
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={!hasChanges}
                          className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                            hasChanges
                              ? "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-200 hover:text-red-700"
                              : "border border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 p-6">
                    {previewMode ? (
                      <div className="h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-green-600" />
                            Preview Mode
                          </h3>
                          <span className="text-sm text-gray-500">
                            How users will see the terms
                          </span>
                        </div>
                        <div 
                          className="h-[500px] overflow-y-auto p-6 bg-gray-50 rounded-xl border border-gray-200 prose prose-red max-w-none"
                          dangerouslySetInnerHTML={{ __html: termsInfo }}
                        />
                      </div>
                    ) : (
                      <div className="h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Code className="w-5 h-5 text-blue-600" />
                            HTML Editor
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500">
                              {charCount} characters
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Lock className="w-3 h-3" />
                              Legal Document
                            </div>
                          </div>
                        </div>
                        <div className="relative h-[500px]">
                          <textarea
                            id="terms"
                            name="terms"
                            value={termsInfo}
                            onChange={(e) => setTermsInfo(e.target.value)}
                            required
                            className="w-full h-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none font-mono text-sm leading-relaxed"
                            placeholder={`<h1>Terms & Conditions</h1>
<h2>1. Acceptance of Terms</h2>
<p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

<h2>2. User Responsibilities</h2>
<p>Users are responsible for maintaining the confidentiality of their account and password.</p>

<h2>3. Prohibited Uses</h2>
<ul>
  <li>Violating any applicable laws</li>
  <li>Infringing intellectual property rights</li>
  <li>Harassing or harming others</li>
</ul>`}
                          />
                          <div className="absolute bottom-4 right-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Globe className="w-3 h-3" />
                              HTML Supported
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Editor Footer */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={loading || !hasChanges}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                          loading || !hasChanges
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow"
                        }`}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            {hasChanges ? "Save Terms & Conditions" : "No Changes to Save"}
                          </>
                        )}
                      </button>
                      
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handlePreview}
                          className="px-4 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-red-200 hover:text-red-700 transition-colors font-medium flex items-center gap-2"
                        >
                          {previewMode ? (
                            <>
                              <Code className="w-4 h-4" />
                              Edit
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Preview
                            </>
                          )}
                        </button>
                        
                        <div className="relative group">
                          <button
                            type="button"
                            className="px-4 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-red-200 hover:text-red-700 transition-colors font-medium flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            More
                          </button>
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 hidden group-hover:block z-10">
                            <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100">
                              Document Actions
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(termsInfo);
                                Swal.fire({
                                  title: "Copied!",
                                  text: "Terms copied to clipboard",
                                  icon: "success",
                                  timer: 1500,
                                  showConfirmButton: false,
                                });
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                            >
                              <ClipboardCheck className="w-3 h-3" />
                              Copy to Clipboard
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const blob = new Blob([termsInfo], { type: 'text/html' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'terms-and-conditions.html';
                                a.click();
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                            >
                              <FileText className="w-3 h-3" />
                              Download as HTML
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {activeSection === "templates" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" />
                    Legal Templates
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Common legal sections for terms and conditions
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templateSections.map((section, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-5 hover:border-red-200 hover:shadow-sm transition-all"
                      >
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Type className="w-4 h-4 text-red-600" />
                          {section.title}
                        </h3>
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg font-mono h-24 overflow-y-auto">
                            {section.template}
                          </div>
                        </div>
                        <button
                          onClick={() => insertTemplate(section.template)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          Insert Template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "history" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-red-600" />
                    Version History
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Recent changes to terms and conditions
                  </p>
                </div>
                
                <div className="p-6">
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((version, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl p-5 hover:border-red-200 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                <span className="text-red-600 font-bold">{version.version}</span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  Version {version.version}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(version.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {index === 0 && (
                              <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{version.content}</p>
                          {index === 0 && (
                            <button
                              onClick={() => setTermsInfo(originalContent)}
                              className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Restore this version
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No version history
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Save changes to start tracking version history
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Legal Disclaimer</h4>
              <p className="text-sm text-blue-700">
                This is a legal document. It is recommended to consult with a legal professional 
                before publishing any terms and conditions. The templates provided are for 
                reference only and may not cover all legal requirements for your specific use case.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTerms;