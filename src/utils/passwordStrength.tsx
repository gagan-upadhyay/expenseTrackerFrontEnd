// utils/passwordStrength.ts
export function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "25%" };
  if (score === 2) return { label: "Fair", color: "bg-yellow-400", width: "50%" };
  if (score === 3) return { label: "Good", color: "bg-blue-400", width: "75%" };
  return { label: "Strong", color: "bg-green-400", width: "100%" };
}