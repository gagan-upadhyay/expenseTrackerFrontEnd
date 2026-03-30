// 'use client';

// import { useState } from "react";

// export default function Preferences() {
//   const [currency, setCurrency] = useState("INR");
//   const [language, setLanguage] = useState("en");

//   return (
//     <div className="flex flex-col gap-4">

//       {/* Currency */}
//       <div className="flex justify-between items-center">
//         <span>Default Currency</span>
//         <select
//           value={currency}
//           onChange={(e) => setCurrency(e.target.value)}
//           className="border rounded-md px-2 py-1"
//         >
//           <option value="INR">₹ INR</option>
//           <option value="USD">$ USD</option>
//           <option value="EUR">€ EUR</option>
//         </select>
//       </div>

//       {/* Language */}
//       <div className="flex justify-between items-center">
//         <span>Language</span>
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="border rounded-md px-2 py-1"
//         >
//           <option value="en">English</option>
//           <option value="hi">Hindi</option>
//         </select>
//       </div>

//     </div>
//   );
// }

'use client';

import { useState } from "react";

export default function Preferences() {
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="card space-y-6">

      <h2 className="section-title">Preferences</h2>

      {/* Theme */}
      <div className="flex justify-between items-center">
        <span>Dark Mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

      {/* Currency */}
      <div className="flex justify-between items-center">
        <span>Default Currency</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input w-32"
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>
      </div>

      {/* Language */}
      <div className="flex justify-between items-center">
        <span>Language</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input w-32"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
    </div>
  );
}