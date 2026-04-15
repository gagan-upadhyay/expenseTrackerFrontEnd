'use client';

import AuthGuard from "@/src/components/auth/Guards/AuthGuard"
import Accordion from "@/src/components/ui/accordion"
// import UserProfile from "@/src/components/settings/userprofile";
import SettingThemes from "@/src/components/settings/themeSettings";
import Preferences from "@/src/components/settings/Preferences";
import ProfileSettings from "@/src/components/settings/ProfileSettings";
import SecuritySettings from "@/src/components/settings/SecuritySettings";
import { useState } from "react";

export default function Page() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  return (
    <AuthGuard>
      <div className="w-full items-center mt-7  glass glass-hover h-auto flex flex-col h-auto rounded-3xl">

        <Accordion title="Profile" isOpen={openAccordion === "Profile"} onToggle={() => toggleAccordion("Profile")}>
          <ProfileSettings />
        </Accordion>

        <Accordion title="Security" isOpen={openAccordion === "Security"} onToggle={() => toggleAccordion("Security")}>
          <SecuritySettings/>
        </Accordion>

        <Accordion title="Appearance" isOpen={openAccordion === "Appearance"} onToggle={() => toggleAccordion("Appearance")}>
          <SettingThemes />
        </Accordion>

        <Accordion title="Preferences" isOpen={openAccordion === "Preferences"} onToggle={() => toggleAccordion("Preferences")}>
          <Preferences/>
        </Accordion>

      </div>
    </AuthGuard>
  );
}



// include Account >> user profile change like fname, lname, profilePicture. also change in email/phone_number with otp verification.
// notifications >> notification alert toggle on off
// appearance >> light/dark mode
// privacy and security if there is a change in privacy and security policy then show it at the top of settings
// help and support
// about
// logout
//promotional/ integration like "checkout our other apps"
