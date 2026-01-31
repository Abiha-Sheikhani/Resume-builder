import { useEffect, useState } from "react";
import supabase from "../config";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import DashboardForm from "./DashboardForm";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    personal_info: { name: "", email: "", phone: "", profilePic: "" },
    education: [],
    work_experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    profile_summary: "",
  });
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user session & resumes
  const fetchResumes = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    setUser(data.user);
    setLoading(true);

    const { data: resumesData, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });

    if (error) Swal.fire("Error", error.message, "error");
    else setResumes(resumesData);

    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // ---------------- CREATE / UPDATE ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("Error", "User not found!", "error");

    let profilePicUrl = formData.personal_info.profilePic;

    // Upload profile pic if selected
    if (file) {
      const fileName = `${user.id}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-pics")
        .upload(fileName, file);

      if (uploadError) return Swal.fire("Error", uploadError.message, "error");

      const { publicURL } = supabase.storage
        .from("profile-pics")
        .getPublicUrl(fileName);

      profilePicUrl = publicURL;
    }

    const payload = {
      ...formData,
      personal_info: { ...formData.personal_info, profilePic: profilePicUrl },
      user_id: user.id,
    };

    if (editingId) {
      const { error } = await supabase
        .from("resumes")
        .update(payload)
        .eq("id", editingId);

      if (error) Swal.fire("Error", error.message, "error");
      else {
        Swal.fire("Updated!", "Resume updated successfully", "success");
        setEditingId(null);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("resumes").insert([payload]);
      if (error) Swal.fire("Error", error.message, "error");
      else Swal.fire("Created!", "Resume created successfully", "success");
    }

    setFile(null);
    setShowForm(false);
    fetchResumes();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      personal_info: { name: "", email: "", phone: "", profilePic: "" },
      education: [],
      work_experience: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      profile_summary: "",
    });
  };

  // ---------------- DELETE ----------------
  const deleteResume = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the resume permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) Swal.fire("Error", error.message, "error");
      else {
        Swal.fire("Deleted!", "Resume deleted successfully", "success");
        fetchResumes();
      }
    }
  };

  // ---------------- EDIT ----------------
  const editResume = (res) => {
    setEditingId(res.id);
    setFormData({
      title: res.title || "",
      personal_info: {
        name: res.personal_info?.name || "",
        email: res.personal_info?.email || "",
        phone: res.personal_info?.phone || "",
        profilePic: res.personal_info?.profilePic || "",
      },
      education: res.education || [],
      work_experience: res.work_experience || [],
      skills: res.skills || [],
      projects: res.projects || [],
      certifications: res.certifications || [],
      languages: res.languages || [],
      profile_summary: res.profile_summary || "",
    });
    setShowForm(true);
  };

  // ---------------- DOWNLOAD PDF ----------------
  const downloadResume = (res) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(res.title, 10, 10);
    doc.setFontSize(12);
    doc.text(res.personal_info.name || "", 10, 20);
    doc.text(res.personal_info.email || "", 10, 30);
    doc.text(res.personal_info.phone || "", 10, 40);
    doc.text(res.profile_summary || "", 10, 50);
    doc.save(`${res.title}.pdf`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-gray-700 animate-bounce">
        My Resumes
      </h1>

      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : editingId ? "Edit Resume" : "Add New Resume"}
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              file={file}
              setFile={setFile}
              editingId={editingId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading...</p>
      ) : resumes.length === 0 ? (
        <p className="text-gray-500">No resumes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {resumes.map((res) => (
            <motion.div
              key={res.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-semibold text-xl">{res.title}</h2>
              {res.personal_info.profilePic && (
                <img
                  src={res.personal_info.profilePic}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mt-2 mb-2 object-cover border-2 border-blue-500"
                />
              )}
              <p className="text-sm text-gray-500 mb-2">
                {res.personal_info.name} - {res.personal_info.email}
              </p>
              <p className="text-gray-600 mb-2">{res.profile_summary}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                  onClick={() => editResume(res)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => deleteResume(res.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                  onClick={() => downloadResume(res)}
                >
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
