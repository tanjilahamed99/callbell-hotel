import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import Swal from "sweetalert2";
import {
  Shield,
  Lock,
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
  FileText,
  ClipboardCheck,
  History,
  BookOpen,
  ChevronRight,
  Database,
  Users,
  Cookie,
  Fingerprint,
  ShieldCheck,
  Bell
} from "lucide-react";

const AdminPrivacy = () => {
  const [privacyInfo, setPrivacyInfo] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const { user } = useCall();
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeSection, setActiveSection] = useState("editor");
  const [complianceCheck, setComplianceCheck] = useState({
    gdpr: false,
    ccpa: false,
    cookies: false,
    dataCollection: false
  });

  useEffect(() => {
    if (privacyInfo !== originalContent) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
    setCharCount(privacyInfo.length);
    
    // Auto-check compliance based on content
    const checkCompliance = () => {
      const content = privacyInfo.toLowerCase();
      setComplianceCheck({
        gdpr: content.includes('gdpr') || content.includes('general data protection regulation'),
        ccpa: content.includes('ccpa') || content.includes('california consumer privacy act'),
        cookies: content.includes('cookies') || content.includes('tracking'),
        dataCollection: content.includes('data collection') || content.includes('personal information')
      });
    };
    
    checkCompliance();
  }, [privacyInfo, originalContent]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedContent = e.target.privacy.value;
    
    try {
      setLoading(true);
      const { data } = await addNewWebsiteData(user.id, user.email, {
        privacy: updatedContent,
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
          text: "Privacy Policy updated successfully.",
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
      console.error("Error updating privacy policy content:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update privacy policy. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPrivacyInfo = async () => {
      try {
        const { data } = await getWebsiteData();
        const privacyContent = data?.data?.privacy || "";
        setPrivacyInfo(privacyContent);
        setOriginalContent(privacyContent);
        
        // Initialize history
        setHistory([{
          timestamp: new Date().toISOString(),
          content: privacyContent.substring(0, 100) + '...',
          version: 1
        }]);
      } catch (err) {
        console.error("Error fetching privacy info:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to load privacy policy. Please refresh the page.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    };
    fetchPrivacyInfo();
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
        setPrivacyInfo(originalContent);
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
      title: "Information Collection",
      icon: <Database className="w-4 h-4" />,
      template: `<h2>Information We Collect</h2>
<p>We collect information you provide directly to us, including:</p>
<ul>
  <li>Personal identification information</li>
  <li>Contact information</li>
  <li>Usage data and analytics</li>
</ul>`
    },
    {
      title: "Cookies & Tracking",
      icon: <Cookie className="w-4 h-4" />,
      template: `<h2>Cookies and Tracking Technologies</h2>
<p>We use cookies and similar tracking technologies to track activity on our service.</p>
<p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>`
    },
    {
      title: "Data Protection",
      icon: <ShieldCheck className="w-4 h-4" />,
      template: `<h2>Data Protection Rights</h2>
<p>You have certain data protection rights, including:</p>
<ul>
  <li>The right to access your personal data</li>
  <li>The right to rectification</li>
  <li>The right to erasure</li>
  <li>The right to restrict processing</li>
</ul>`
    },
    {
      title: "Third-Party Sharing",
      icon: <Users className="w-4 h-4" />,
      template: `<h2>Third-Party Data Sharing</h2>
<p>We may share your information with third parties in the following circumstances:</p>
<ul>
  <li>With service providers</li>
  <li>For legal compliance</li>
  <li>To protect rights and safety</li>
</ul>`
    }
  ];

  const complianceRequirements = [
    {
      name: "GDPR Compliance",
      description: "General Data Protection Regulation (EU)",
      icon: <Globe className="w-4 h-4" />,
      checked: complianceCheck.gdpr,
      color: "green"
    },
    {
      name: "CCPA Compliance",
      description: "California Consumer Privacy Act",
      icon: <Bell className="w-4 h-4" />,
      checked: complianceCheck.ccpa,
      color: "blue"
    },
    {
      name: "Cookie Policy",
      description: "Cookie consent and tracking disclosure",
      icon: <Cookie className="w-4 h-4" />,
      checked: complianceCheck.cookies,
      color: "yellow"
    },
    {
      name: "Data Collection",
      description: "Clear data collection statement",
      icon: <Database className="w-4 h-4" />,
      checked: complianceCheck.dataCollection,
      color: "purple"
    }
  ];

  const insertTemplate = (template) => {
    setPrivacyInfo(prev => prev + "\n\n" + template);
  };

  const getComplianceScore = () => {
    const checks = Object.values(complianceCheck);
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-red-50">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Privacy Policy Editor
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your website's privacy policy and data protection terms
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
                  onClick={() => handleSectionChange("compliance")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeSection === "compliance"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-medium">Compliance</span>
                  </div>
                  {activeSection === "compliance" && <ChevronRight className="w-4 h-4" />}
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

            {/* Compliance Score */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  Compliance Score
                </h3>
                <div className={`text-2xl font-bold ${
                  getComplianceScore() >= 75 ? 'text-green-600' : 
                  getComplianceScore() >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {getComplianceScore()}%
                </div>
              </div>
              <div className="space-y-3">
                {complianceRequirements.map((req, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        req.checked ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-700">{req.name}</span>
                    </div>
                    {req.checked ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Privacy Tips
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                  <span>Clearly state what data you collect</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                  <span>Explain how you use collected data</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                  <span>Include cookie and tracking policies</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                  <span>Provide contact for privacy concerns</span>
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
                          <Shield className="w-5 h-5 text-red-600" />
                          Privacy Policy Content
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Edit your website's privacy policy and data protection terms
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
                            How users will see the privacy policy
                          </span>
                        </div>
                        <div 
                          className="h-[500px] overflow-y-auto p-6 bg-gray-50 rounded-xl border border-gray-200 prose prose-blue max-w-none"
                          dangerouslySetInnerHTML={{ __html: privacyInfo }}
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
                              Privacy Document
                            </div>
                          </div>
                        </div>
                        <div className="relative h-[500px]">
                          <textarea
                            id="privacy"
                            name="privacy"
                            value={privacyInfo}
                            onChange={(e) => setPrivacyInfo(e.target.value)}
                            required
                            className="w-full h-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none font-mono text-sm leading-relaxed"
                            placeholder={`<h1>Privacy Policy</h1>
<p>Last updated: ${new Date().toLocaleDateString()}</p>

<h2>1. Information We Collect</h2>
<p>We collect several different types of information for various purposes to provide and improve our service to you.</p>

<h2>2. Use of Data</h2>
<p>We use the collected data for various purposes:</p>
<ul>
  <li>To provide and maintain our service</li>
  <li>To notify you about changes to our service</li>
  <li>To allow you to participate in interactive features</li>
</ul>

<h2>3. Data Protection</h2>
<p>We value your trust in providing us your personal information, thus we are striving to use commercially acceptable means of protecting it.</p>`}
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
                            {hasChanges ? "Save Privacy Policy" : "No Changes to Save"}
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
                                navigator.clipboard.writeText(privacyInfo);
                                Swal.fire({
                                  title: "Copied!",
                                  text: "Privacy policy copied to clipboard",
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
                                const blob = new Blob([privacyInfo], { type: 'text/html' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'privacy-policy.html';
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

            {activeSection === "compliance" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    Compliance Checklist
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Essential privacy policy requirements
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Overall Compliance Score</h3>
                        <p className="text-sm text-gray-500">Based on content analysis</p>
                      </div>
                      <div className="relative">
                        <div className="text-5xl font-bold text-gray-900">{getComplianceScore()}%</div>
                        <div className={`absolute -right-2 -top-2 w-4 h-4 rounded-full ${
                          getComplianceScore() >= 75 ? 'bg-green-500' : 
                          getComplianceScore() >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        } animate-pulse`}></div>
                      </div>
                    </div>
                    
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          getComplianceScore() >= 75 ? 'bg-green-500' : 
                          getComplianceScore() >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${getComplianceScore()}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {complianceRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`border rounded-xl p-5 transition-all ${
                          req.checked
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              req.checked ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {req.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{req.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                            </div>
                          </div>
                          <div>
                            {req.checked ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">Included</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-500">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">Missing</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {!req.checked && (
                          <button
                            onClick={() => {
                              // Insert relevant template
                              const template = templateSections.find(t => 
                                t.title.toLowerCase().includes(req.name.toLowerCase().split(' ')[0])
                              );
                              if (template) {
                                insertTemplate(template.template);
                                Swal.fire({
                                  title: "Template Added!",
                                  text: `Added ${template.title} section to improve compliance.`,
                                  icon: "success",
                                  timer: 2000,
                                  showConfirmButton: false
                                });
                                handleSectionChange("editor");
                              }
                            }}
                            className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            Add relevant template
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "templates" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" />
                    Privacy Policy Templates
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Common sections for privacy policies
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templateSections.map((section, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-5 hover:border-red-200 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            {section.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900">
                            {section.title}
                          </h3>
                        </div>
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg font-mono h-24 overflow-y-auto">
                            {section.template}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            insertTemplate(section.template);
                            Swal.fire({
                              title: "Template Added!",
                              text: `${section.title} section added to privacy policy.`,
                              icon: "success",
                              timer: 1500,
                              showConfirmButton: false,
                            });
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
                    Recent changes to privacy policy
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
                              onClick={() => setPrivacyInfo(originalContent)}
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

        {/* Important Notice */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 mb-1">Important Legal Notice</h4>
              <p className="text-sm text-red-700">
                This privacy policy is a legal document. It is strongly recommended to consult 
                with a legal professional specializing in data protection laws to ensure compliance 
                with regulations like GDPR, CCPA, and other applicable laws in your jurisdiction. 
                The templates provided are for reference only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPrivacy;