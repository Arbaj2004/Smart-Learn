import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, FileText, X } from "lucide-react";

const ImportStudents = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [importedStudents, setImportedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const clearFileSelection = () => {
    setFile(null);
    setFileName("");
    // Reset the hidden file input
    document.getElementById('hidden-file-input').value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/importStudents`;
      
      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setImportedStudents(response.data.data.students);
        toast.success(`Successfully imported ${response.data.results} students!`);
        clearFileSelection();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import students.");
      console.error("Import Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('hidden-file-input').click();
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Import Students
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Upload a CSV file containing student information
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                CSV File
              </label>
              
              {/* Hidden actual file input */}
              <input
                id="hidden-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {/* Custom file input UI */}
              <div className="mt-1 flex items-center">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <div className="flex items-center justify-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-400" />
                    {fileName ? 'Change File' : 'Choose CSV File'}
                  </div>
                </button>
              </div>
              
              {/* Show selected file name if a file is selected */}
              {fileName && (
                <div className="mt-2 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <div className="flex items-center truncate">
                    <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm text-gray-600 truncate">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearFileSelection}
                    className="ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <p className="mt-1 text-xs text-gray-500">
                File should contain columns for Name, Email, Password, MIS, and Department
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !file}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!file ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? (
                  "Importing..."
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Import Students
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {importedStudents.length > 0 && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Imported Students</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MIS
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importedStudents.map((student, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.mis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportStudents;