type ContactCardProps = {
  title: string;
  email: string;
  description: string;
  theme:string;
};

export default function ContactCard({ title, email, description, theme }: ContactCardProps) {
  return (
    <div className={`${theme==='light'?'border-blue-200':'border-gray-700'} border rounded-lg p-4 shadow-md`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className={`${theme==='light' ? 'text-gray-900':'text-neutral-300'} text-sm mb-2`}>{description}</p>
      <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
        {email}
      </a>
    </div>
  );
}
