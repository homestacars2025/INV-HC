import { Car } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper-2 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-paper rounded-2xl shadow-lifted border border-line p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mb-4 shadow-card">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-ink">هوميستا كارز</h1>
              <p className="text-sm text-ink-4 mt-1">بوابة المستثمرين</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-line mb-6" />

          {/* Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-ink-4 mt-6">
          © {new Date().getFullYear()} Homesta Cars — إسطنبول
        </p>
      </div>
    </main>
  );
}
