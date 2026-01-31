// Dashboard.jsx
import { useEffect, useState } from "react";
import supabase from "../config";
import { useNavigate } from "react-router-dom";
import DashboardForm from "./DashboardForm";
import "../App.css";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null); // Your resume
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("my"); // "my", "all", "create"
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

  const navigate = useNavigate();

  // Fetch all resumes
  const fetchResumes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setResumes(data);
      setSelectedResume(data[0] || null); // default to first resume
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Delete your resume
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    await supabase.from("resumes").delete().eq("id", id);
    fetchResumes();
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

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <button className={`sidebar-btn ${view === "my" ? "active" : ""}`} onClick={() => setView("my")}>
          My Resume
        </button>
        <button className={`sidebar-btn ${view === "all" ? "active" : ""}`} onClick={() => setView("all")}>
          All Resumes
        </button>
        <button className={`sidebar-btn ${view === "create" ? "active" : ""}`} onClick={() => setView("create")}>
          Create Resume
        </button>
        <button className="sidebar-btn logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="dashboard-main">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : view === "create" ? (
          <DashboardForm
            formData={formData}
            setFormData={setFormData}
            file={file}
            setFile={setFile}
            fetchResumes={fetchResumes}
            setView={setView}
          />
        ) : view === "my" ? (
          selectedResume ? (
            <div className="section">
              <h3 className="section-title">My Resume</h3>
              <div className="resume-card">
                {selectedResume.personal_info.profilePic && (
                  <img
                    src={selectedResume.personal_info.profilePic}
                    alt="Profile"
                    className="profile-pic"
                  />
                )}
                <h2>{selectedResume.title}</h2>
                <p><strong>Name:</strong> {selectedResume.personal_info.name}</p>
                <p><strong>Summary:</strong> {selectedResume.profile_summary}</p>
                <div className="resume-actions">
                  <button className="edit-btn" onClick={() => {
                    setFormData(selectedResume);
                    setView("create");
                  }}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(selectedResume.id)}>Delete</button>
                  <button className="view-btn" onClick={() => navigate(`/resume-detail?id=${selectedResume.id}`)}>View</button>
                </div>
              </div>
            </div>
          ) : (
            <p>You have not created any resume yet.</p>
          )
        ) : view === "all" ? (
          <div className="section">
            <h3 className="section-title">All Resumes</h3>
            {resumes.length === 0 ? (
              <p>No resumes found.</p>
            ) : (
              <div className="resumes-grid">
                {resumes.map((res) => (
                  <div key={res.id} className="resume-card">
                    {res.personal_info.profilePic && (
                      <img
                        src={res.personal_info.profilePic}
                        alt="Profile"
                        className="profile-pic"
                      />
                    )}
                    <h2>{res.title}</h2>
                    <p><strong>Name:</strong> {res.personal_info.name}</p>
                    <p><strong>Summary:</strong> {res.profile_summary}</p>
                    <button className="view-btn" onClick={() => navigate(`/resume-detail?id=${res.id}`)}>View</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
