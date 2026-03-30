import AuthGuard from "@/src/components/auth/Guards/AuthGuard";

export default function HelpPage() {
  return (
    <AuthGuard>
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="mt-3 text-sm text-gray-500">Need assistance? This page consolidates user guides and FAQs.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="glass p-4 rounded-xl">
            <h2 className="font-semibold">Getting Started</h2>
            <p className="text-sm mt-2">Learn how to set accounts, add cards, and manage transactions.</p>
          </div>
          <div className="glass p-4 rounded-xl">
            <h2 className="font-semibold">Contact Support</h2>
            <p className="text-sm mt-2">Email us at <a className="text-blue-500">support@example.com</a> for additional help.</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
