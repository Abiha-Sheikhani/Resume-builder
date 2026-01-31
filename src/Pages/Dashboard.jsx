// Dashboard.jsx
import { useEffect, useState } from "react";
import supabase from "../config";
import { useNavigate } from "react-router-dom";
import DashboardForm from "./DashboardForm";
import "../App.css";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
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
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch current user and all resumes
  const fetchResumes = async () => {
    setLoading(true);
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      navigate("/");
      return;
    }

    setUser(currentUser);

    const { data: resumesData, error } = await supabase
      .from("resumes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Failed to fetch resumes: " + error.message);
    } else {
      setResumes(resumesData || []);
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

  // Delete resume
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (!error) {
      alert("Resume deleted!");
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
      setEditingId(null);
      setView("my");
    } else {
      alert("Failed to delete resume: " + error.message);
    }
  };

  // Create or Update resume
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    let profilePicUrl = formData.personal_info.profilePic;

    // Upload profile picture if selected
    if (file) {
      const fileName = `${user.id}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-pics")
        .upload(fileName, file);

      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { publicUrl } = supabase.storage
        .from("profile-pics")
        .getPublicUrl(fileName);

      profilePicUrl = publicUrl;
    }

    const payload = {
      ...formData,
      personal_info: { ...formData.personal_info, profilePic: profilePicUrl },
      user_id: user.id,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("resumes").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("resumes").insert([payload]));
    }

    setLoading(false);

    if (!error) {
      alert(editingId ? "Resume updated!" : "Resume created!");
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
      setFile(null);
      setEditingId(null);
      setView("my");
      fetchResumes();
    } else {
      alert("Failed to save resume: " + error.message);
    }
  };

  // Filter resumes by current user
  const myResumes = resumes.filter((r) => r.user_id === user?.id);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <button
          className={`sidebar-btn ${view === "my" ? "active" : ""}`}
          onClick={() => setView("my")}
        >
          My Resume
        </button>
        <button
          className={`sidebar-btn ${view === "all" ? "active" : ""}`}
          onClick={() => setView("all")}
        >
          All Resumes
        </button>
        <button
          className={`sidebar-btn ${view === "create" ? "active" : ""}`}
          onClick={() => setView("create")}
        >
          Create Resume
        </button>
        <button className="sidebar-btn logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="dashboard-main">
        {loading ? (
          <p>Loading...</p>
        ) : view === "create" ? (
          <DashboardForm
            formData={formData}
            setFormData={setFormData}
            file={file}
            setFile={setFile}
            handleSubmit={handleSubmit}
            editingId={editingId}
          />
        ) : view === "my" ? (
          <>
            <h3 className="section-title">My Resumes</h3>
            {myResumes.length === 0 ? (
              <p>You have not created any resume yet.</p>
            ) : (
              <div className="resumes-grid">
                {myResumes.map((res) => (
                  <div key={res.id} className="resume-card">
                    {res.personal_info.profilePic && (
                      <img
                        src={res.personal_info.profilePic}
                        alt="Profile"
                        className="profile-pic"
                      />
                    )}
                    <h2>{res.title}</h2>
                    <p>
                      <strong>Name:</strong> {res.personal_info.name}
                    </p>
                    <p>
                      <strong>Summary:</strong> {res.profile_summary}
                    </p>
                    <div className="resume-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setFormData(res);
                          setEditingId(res.id);
                          setView("create");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(res.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/resume-detail?id=${res.id}`)
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : view === "all" ? (
          <>
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
                    <p>
                      <strong>Name:</strong> {res.personal_info.name}
                    </p>
                    <p>
                      <strong>Summary:</strong> {res.profile_summary}
                    </p>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/resume-detail?id=${res.id}`)
                      }
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
