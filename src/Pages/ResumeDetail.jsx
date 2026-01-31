import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../config";
import Swal from "sweetalert2";
import "../index.css"


const ResumeDetail = () => {
  const [resume,setResume] = useState(null);
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");

  useEffect(()=>{
    if(id){
      const fetchResume = async ()=>{
        const { data, error } = await supabase.from("resumes").select("*").eq("id",id).single();
        if(error) Swal.fire("Error",error.message,"error");
        else setResume(data);
      };
      fetchResume();
    }
  },[id]);

  if(!resume) return <p>Loading...</p>;

 return (
  <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
      
      {/* Header Section */}
      <div className="bg-blue-900 text-white p-8 flex flex-col md:flex-row items-center gap-6">
        {resume.personal_info.profilePic && (
          <img 
            src={resume.personal_info.profilePic} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" 
            alt="Profile"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight">{resume.personal_info.name}</h1>
          <p className="text-xl text-blue-200 mt-1">{resume.title}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-blue-100">
            <span>📧 {resume.personal_info.email}</span>
            <span>📞 {resume.personal_info.phone}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Profile Summary */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-3 uppercase tracking-wide">Profile Summary</h2>
          <p className="text-gray-700 leading-relaxed italic">"{resume.profile_summary}"</p>
        </section>

        {/* Experience & Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resume.work_experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wide">Work Experience</h2>
              <div className="space-y-4">
                {resume.work_experience.map((w, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-bold text-gray-800">{w.position}</p>
                    <p className="text-sm text-blue-600 font-medium">{w.company} | {w.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wide">Education</h2>
              <div className="space-y-4">
                {resume.education.map((e, i) => (
                  <div key={i} className="border-l-4 border-gray-300 pl-4">
                    <p className="font-bold text-gray-800">{e.degree}</p>
                    <p className="text-sm text-gray-600">{e.institution} ({e.year})</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resume.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wide">Projects</h2>
              <ul className="space-y-3">
                {resume.projects.map((p, i) => (
                  <li key={i}>
                    <span className="font-bold text-gray-800 block">{p.title}</span>
                    <span className="text-sm text-gray-600">{p.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="space-y-6">
            {resume.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-3 uppercase tracking-wide">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {resume.languages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-3 uppercase tracking-wide">Languages</h2>
                <p className="text-gray-700 font-medium">{resume.languages.join(" • ")}</p>
              </div>
            )}
          </section>
        </div>
      </div>
      
      {/* Footer / Print Button */}
      <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end print:hidden">
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
        >
          Download PDF / Print
        </button>
      </div>
    </div>
  </div>
);

};

export default ResumeDetail;
