import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface TextInputProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  type?: "text" | "email" | "tel";
}

export const TextInput = ({ placeholder, onSubmit, type = "text" }: TextInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex justify-end mb-4"
    >
      <div className="flex items-center gap-2 bg-chat-user rounded-full px-4 py-2 shadow-lg max-w-[85%] md:max-w-[70%]">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-white placeholder:text-zinc-50 focus:outline-none min-w-[150px] md:min-w-[200px]"
          autoFocus
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-white text-primary-foreground"
        >
          <Send size={16} />
        </button>
      </div>
    </motion.form>
  );
};
