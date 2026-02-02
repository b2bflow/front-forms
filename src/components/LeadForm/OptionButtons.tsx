import { motion } from "framer-motion";

interface OptionButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const OptionButtons = ({ options, onSelect }: OptionButtonsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap justify-end gap-2 mb-4"
    >
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          onClick={() => onSelect(option)}
          className="px-5 py-3 bg-chat-user text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium"
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
};
