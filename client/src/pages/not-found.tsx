import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md mx-4 bg-gradient-to-br from-purple-900/30 to-black rounded-xl border border-purple-900/30 shadow-lg shadow-purple-900/20 p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-purple-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">404</h1>
          <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-6">
            We couldn't find the page you were looking for.
          </p>
          
          <Link href="/">
            <a className="nightclub-button inline-flex items-center">
              <i className="ri-home-line mr-2"></i>
              Back to Dashboard
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
