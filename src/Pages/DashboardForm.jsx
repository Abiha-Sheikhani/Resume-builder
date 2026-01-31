import "../index.css";

const DashboardForm = ({ formData, setFormData, handleSubmit, file, setFile, editingId }) => {
  const addItem = (key) => setFormData({ ...formData, [key]: [...formData[key], {}] });
  const removeItem = (key, idx) => {
    const arr = [...formData[key]];
    arr.splice(idx, 1);
    setFormData({ ...formData, [key]: arr });
  };
  const updateItem = (key, idx, field, value) => {
    const arr = [...formData[key]];
    arr[idx][field] = value;
    setFormData({ ...formData, [key]: arr });
  };
  const handleArrayChange = (key, value) => {
    setFormData({ ...formData, [key]: value.split(",").map(s => s.trim()).filter(Boolean) });
  };

  return (
    <form className="bg-white p-6 rounded-xl shadow-lg space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold text-gray-700">
        {editingId ? "Edit Resume" : "Create New Resume"}
      </h2>

      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Resume Title</label>
          <input type="text" placeholder="Resume Title" value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
        <div>
          <label>Full Name</label>
          <input type="text" placeholder="Full Name" value={formData.personal_info.name}
            onChange={(e) => setFormData({ ...formData, personal_info: { ...formData.personal_info, name: e.target.value } })} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" placeholder="Email" value={formData.personal_info.email}
            onChange={(e) => setFormData({ ...formData, personal_info: { ...formData.personal_info, email: e.target.value } })} required />
        </div>
        <div>
          <label>Phone</label>
          <input type="text" placeholder="Phone" value={formData.personal_info.phone}
            onChange={(e) => setFormData({ ...formData, personal_info: { ...formData.personal_info, phone: e.target.value } })} />
        </div>
        <div className="md:col-span-2">
          <label>Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
      </div>

      {/* Profile Summary */}
      <div>
        <label>Profile Summary</label>
        <textarea placeholder="Short summary" value={formData.profile_summary}
          onChange={(e) => setFormData({ ...formData, profile_summary: e.target.value })} rows={3} />
      </div>

      {/* Skills / Languages */}
      <div>
        <label>Skills (comma separated)</label>
        <input type="text" value={formData.skills.join(", ")}
          onChange={(e) => handleArrayChange("skills", e.target.value)} />
      </div>
      <div>
        <label>Languages (comma separated)</label>
        <input type="text" value={formData.languages.join(", ")}
          onChange={(e) => handleArrayChange("languages", e.target.value)} />
      </div>

      <button type="submit">{editingId ? "Update Resume" : "Create Resume"}</button>
    </form>
  );
};

export default DashboardForm;
