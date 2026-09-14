import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { Mail, Lock, User } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BrandMark } from "../components/Brand";

const BENEFITS = [
  "Free while you are job hunting",
  "Secure email & password sign up",
  "Continue with Google in one click",
];

const Register = () => {
  const { user, register, googleLogin } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error("Name, email and password are required");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google credential not found");
        return;
      }

      await googleLogin(credentialResponse.credential);
    } catch (error) {
      toast.error(error.message || "Google sign up failed");
    }
  };

  return (
    <div className="relative grid min-h-screen items-center gap-[28px] overflow-hidden bg-canvas px-[20px] py-[40px] text-fg [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] min-[900px]:gap-12 min-[900px]:px-10 min-[900px]:py-14">
      <img
        src="/landing/orb-violet.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-[220px] -top-[180px] hidden w-[620px] opacity-50 blur-[8px] sm:block"
      />
      <img
        src="/landing/orb-sunset.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[260px] -right-[240px] hidden w-[620px] opacity-40 blur-[8px] sm:block"
      />

      <div className="relative mx-auto w-full max-w-[520px] justify-self-center min-[900px]:justify-self-end">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3.5 py-1.5 text-sm text-fg-muted">
          <span className="h-[7px] w-[7px] rounded-full bg-ai-500" />
          EmlyAI
        </div>

        <h1
          className="mt-5 font-light"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px,5vw,60px)", lineHeight: 1, letterSpacing: "-0.035em" }}
        >
          Start sending smarter applications today.
        </h1>

        <p className="mt-5 max-w-[420px] text-base leading-relaxed text-fg-muted">
          Create your account to upload resumes, analyze job descriptions and apply in one click.
        </p>

        <div className="mt-7 flex max-w-[420px] flex-col gap-2.5">
          {BENEFITS.map((text, i) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-2xl border border-border bg-elevated px-4 py-3.5 text-sm transition-transform hover:translate-x-1"
            >
              <span
                className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-surface-sunken text-fg-muted"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
              >
                {i + 1}
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[440px] justify-self-center min-[900px]:justify-self-start">
        <div
          className="rounded-[26px] border border-border bg-elevated p-[22px] min-[900px]:p-9"
          style={{ boxShadow: "0 40px 80px -50px rgba(20,18,15,.4)" }}
        >
          <div className="flex justify-center">
            <BrandMark size={44} className="rounded-2xl bg-brand-500 p-2.5" />
          </div>

          <h2
            className="mt-4 text-center font-medium"
            style={{ fontFamily: "var(--font-display)", fontSize: 26, letterSpacing: "-0.025em" }}
          >
            Create your account
          </h2>
          <p className="mt-1.5 text-center text-sm text-fg-muted">Join EmlyAI and automate your applications</p>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign up failed")}
              theme="outline"
              shape="pill"
              size="large"
              text="signup_with"
            />
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] tracking-wide text-fg-subtle">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
              <Input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
              <Input
                type="password"
                name="password"
                placeholder="Password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="pl-10"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-fg-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-fg underline underline-offset-4">
              Sign in
            </Link>
          </p>

          <Link to="/" className="mt-3.5 block text-center text-xs text-fg-subtle hover:text-fg-muted">
            Back to landing page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
