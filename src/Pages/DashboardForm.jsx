// DashboardForm.jsx
import { useState } from "react";
import "../index.css"

const DashboardForm = ({ formData, setFormData, handleSubmit, file, setFile, editingId }) => {
  // Add item to array field
  const addItem = (key) => setFormData({ ...formData, [key]: [...formData[key], {}] });

  // Remove item from array field
  const removeItem = (key, idx) => {
    const arr = [...formData[key]];
    arr.splice(idx, 1);
    setFormData({ ...formData, [key]: arr });
  };

  // Update field inside array item
  const updateItem = (key, idx, field, value) => {
    const arr = [...formData[key]];
    arr[idx][field] = value;
    setFormData({ ...formData, [key]: arr });
  };

  // Handle comma-separated arrays (skills, languages)
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
          <label className="font-medium">Resume Title</label>
          <input
            type="text"
            placeholder="Resume Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="font-medium">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.personal_info.name}
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, name: e.target.value } })
            }
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="font-medium">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={formData.personal_info.email}
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, email: e.target.value } })
            }
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="font-medium">Phone</label>
          <input
            type="text"
            placeholder="Phone"
            value={formData.personal_info.phone}
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, phone: e.target.value } })
            }
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="font-medium">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border rounded p-2 w-full" />
        </div>
      </div>

      {/* Profile Summary */}
      <div>
        <label className="font-medium">Profile Summary</label>
        <textarea
          placeholder="Write a short summary about yourself"
          value={formData.profile_summary}
          onChange={(e) => setFormData({ ...formData, profile_summary: e.target.value })}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Education */}
      <div>
        <label className="font-medium">Education</label>
        {formData.education.map((edu, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) => updateItem("education", idx, "degree", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) => updateItem("education", idx, "institution", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <button type="button" onClick={() => removeItem("education", idx)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("education")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          + Add Education
        </button>
      </div>

      {/* Work Experience */}
      <div>
        <label className="font-medium">Work Experience</label>
        {formData.work_experience.map((work, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Position"
              value={work.position || ""}
              onChange={(e) => updateItem("work_experience", idx, "position", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="text"
              placeholder="Company"
              value={work.company || ""}
              onChange={(e) => updateItem("work_experience", idx, "company", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <button type="button" onClick={() => removeItem("work_experience", idx)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("work_experience")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          + Add Work
        </button>
      </div>

      {/* Projects */}
      <div>
        <label className="font-medium">Projects</label>
        {formData.projects.map((proj, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Project Title"
              value={proj.title || ""}
              onChange={(e) => updateItem("projects", idx, "title", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="text"
              placeholder="Description"
              value={proj.description || ""}
              onChange={(e) => updateItem("projects", idx, "description", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <button type="button" onClick={() => removeItem("projects", idx)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("projects")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          + Add Project
        </button>
      </div>

      {/* Certifications */}
      <div>
        <label className="font-medium">Certifications</label>
        {formData.certifications.map((cert, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Certification Name"
              value={cert.name || ""}
              onChange={(e) => updateItem("certifications", idx, "name", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="text"
              placeholder="Institution"
              value={cert.institution || ""}
              onChange={(e) => updateItem("certifications", idx, "institution", e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <button type="button" onClick={() => removeItem("certifications", idx)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("certifications")} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          + Add Certification
        </button>
      </div>

      {/* Skills */}
      <div>
        <label className="font-medium">Skills (comma separated)</label>
        <input
          type="text"
          placeholder="JavaScript, React, CSS"
          value={formData.skills.join(", ")}
          onChange={(e) => handleArrayChange("skills", e.target.value)}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Languages */}
      <div>
        <label className="font-medium">Languages (comma separated)</label>
        <input
          type="text"
          placeholder="English, Urdu"
          value={formData.languages.join(", ")}
          onChange={(e) => handleArrayChange("languages", e.target.value)}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        {editingId ? "Update Resume" : "Create Resume"}
      </button>
    </form>
  );
};

export default DashboardForm;
