// src/components/ContactButton.tsx
import React from "react";

const ContactButton: React.FC = () => {
  return (
    <button
      className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      aria-label="تماس با ما"
    >
      تماس با ما
    </button>
  );
};

export default ContactButton;
