import { useState } from "react";
import  supabase  from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "../App.css";

const CardBackground = ({ activeView }) => {
  return <div className={`card-bg ${activeView === "login" ? "login" : ""}`} />;
};



const HeroPanel = ({ type, activeView, title, text, buttonText, onToggle }) => {
  return (
    <div className={`hero ${type} ${activeView === type ? "active" : ""}`}>
      <h2>{title}</h2>
      <p>{text}</p>
      <button type="button" onClick={onToggle}>
        {buttonText}
      </button>
    </div>
  );
};

/* ---------------- REGISTER FORM ---------------- */
const RegisterForm = ({ activeView, toggleView }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Fill all fields!",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    // 1️⃣ Signup user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
        timer: 2500,
        showConfirmButton: false,
      });
    } else {
      // 2️⃣ Save user to `users_data` table
      const { error: insertError } = await supabase
        .from("users_data")
        .insert([
          {
            uid: data.user.id, // Supabase user ID
            name: name,
            email: email,
            role: "user",
          },
        ]);

      if (insertError) {
        Swal.fire({
          icon: "error",
          title: insertError.message,
          timer: 2500,
          showConfirmButton: false,
        });
        return;
      }

      // 3️⃣ Success alert
      Swal.fire({
        icon: "success",
        title: "Signup successful! Redirecting to login...",
        timer: 2000,
        showConfirmButton: false,
      });

      // 4️⃣ Reset fields
      setName("");
      setEmail("");
      setPassword("");

      // 5️⃣ Switch to login automatically
      toggleView(); // ✅ Now works because it's passed from parent
    }
  };

  return (
    <div className={`form register ${activeView === "register" ? "active" : ""}`}>
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? "PLEASE WAIT..." : "SIGN UP"}
        </button>
      </form>
    </div>
  );
};

/* ---------------- LOGIN FORM ---------------- */

const LoginForm = ({ activeView }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
       Swal.fire({
          icon: "warning",
          title: "Fill all fields!",
          timer: 2000,
          showConfirmButton: false,
        });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: response.error.message,
        timer: 2500,
        showConfirmButton: false,
      })
    } else {
     Swal.fire({
  icon: "success",
  title: "Logged in successfully!",
  timer: 2000,
  showConfirmButton: false,
}).then(() => {
  navigate("/dashboard");
});
    }
  };

  return (
    <div className={`form login ${activeView === "login" ? "active" : ""}`}>
      <h2>Login</h2>
      
      <p>Or use your email address</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a style={{ paddingTop: 6, marginBottom: 7 }}>
          Forgot password?
        </a>
        <button disabled={loading}>
          {loading ? "PLEASE WAIT..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

export const Login4 = () => {
  const [activeView, setActiveView] = useState("login");

  const toggleView = () => {
    setActiveView(activeView === "login" ? "register" : "login");
  };

  return (
    <section className="page login-4-page">
      <div className="login-4-card">
        <CardBackground activeView={activeView} />

        <HeroPanel
          type="register"
          activeView={activeView}
          title="Welcome back"
          text="Login to review your latest profit from investments."
          buttonText="LOGIN"
          onToggle={toggleView}
        />

<RegisterForm
  activeView={activeView}
  toggleView={toggleView} 
/>

        <HeroPanel
          type="login"
          activeView={activeView}
          title="Hello there"
          text="Begin your journey using this software, and start earning now."
          buttonText="SIGN UP"
          onToggle={toggleView}
        />

        <LoginForm activeView={activeView} />
      </div>
    </section>
  );
};
