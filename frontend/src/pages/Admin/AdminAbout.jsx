import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import Swal from "sweetalert2";
import {
  FileText,
  Save,
  RefreshCw,
  Eye,
  Code,
  AlertCircle,
  CheckCircle,
  Edit2,
  Globe,
  Info,
  Type,
  Upload
} from "lucide-react";

const AdminAbout = () => {
  const [aboutInfo, setAboutInfo] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const { user } = useCall();
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (aboutInfo !== originalContent) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
    setCharCount(aboutInfo.length);
  }, [aboutInfo, originalContent]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedContent = e.target.about.value;
    
    try {
      setLoading(true);
      const { data } = await addNewWebsiteData(user.id, user.email, {
        about: updatedContent,
      });
      if (data.success) {
        setRefetch(!refetch);
        setOriginalContent(updatedContent);
        setHasChanges(false);
        Swal.fire({
          title: "Success!",
          text: "About page content updated successfully.",
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
      console.error("Error updating about content:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update about content. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const { data } = await getWebsiteData();
        const aboutContent = data?.data?.about || "";
        setAboutInfo(aboutContent);
        setOriginalContent(aboutContent);
      } catch (err) {
        console.error("Error fetching about info:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to load about content. Please refresh the page.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    };
    fetchAboutInfo();
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
        setAboutInfo(originalContent);
        setHasChanges(false);
      }
    });
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-red-50">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                About Page Editor
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and edit your website's about page content
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-red-600" />
                Content Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Character Count</span>
                  <span className="text-2xl font-bold text-gray-900">{charCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Word Count</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {aboutInfo.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lines</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {aboutInfo.split('\n').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-red-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-red-200 hover:text-red-700 transition-colors font-medium"
                >
                  {previewMode ? (
                    <>
                      <Code className="w-4 h-4" />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Preview Mode
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors font-medium ${
                    hasChanges
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-200 hover:text-red-700"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Changes
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                HTML Tips
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Use proper HTML tags for formatting</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Include headings (h1-h6) for structure</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Add links with &lt;a href=""&gt; tags</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                  <span>Use &lt;p&gt; tags for paragraphs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Editor */}
          <div className="lg:col-span-2">
            <form onSubmit={handleUpdate} className="h-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                {/* Editor Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Type className="w-5 h-5 text-red-600" />
                        About Page Content
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Edit the HTML content for your about page
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasChanges && (
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full border border-yellow-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Unsaved Changes
                        </span>
                      )}
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
                          Preview
                        </h3>
                        <span className="text-sm text-gray-500">
                          This is how your content will appear
                        </span>
                      </div>
                      <div 
                        className="h-[400px] overflow-y-auto p-6 bg-gray-50 rounded-xl border border-gray-200 prose prose-red max-w-none"
                        dangerouslySetInnerHTML={{ __html: aboutInfo }}
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
                          <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        </div>
                      </div>
                      <div className="relative h-[400px]">
                        <textarea
                          id="about"
                          name="about"
                          value={aboutInfo}
                          onChange={(e) => setAboutInfo(e.target.value)}
                          required
                          className="w-full h-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none font-mono text-sm"
                          placeholder="<h1>Welcome to Our Platform</h1>
<p>Start writing your about page content here...</p>
<p>You can use HTML tags for formatting.</p>"
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
                          {hasChanges ? "Save Changes" : "No Changes to Save"}
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
                            Additional Actions
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(aboutInfo);
                              Swal.fire({
                                title: "Copied!",
                                text: "Content copied to clipboard",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false,
                              });
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                          >
                            Copy to Clipboard
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const blob = new Blob([aboutInfo], { type: 'text/html' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'about-page.html';
                              a.click();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                          >
                            Download as HTML
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Status Bar */}
            {hasChanges && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-700 font-medium">
                      You have unsaved changes
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            )}

            {/* Last Updated Info */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  Content is automatically saved when you click "Save Changes"
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;