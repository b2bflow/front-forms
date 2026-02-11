import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-sm border border-border rounded-2xl p-4 mb-8 flex items-center justify-between shadow-xl "
    >
      <div className="flex items-center gap-3">
        <img src={logo} alt="B2BFlow" className="h-10 w-10 rounded-lg object-cover" />
        <span className="font-bold text-xl text-black">
          B2b<span className="text-primary">Flow</span>
        </span>
      </div>
      <p className="
        text-black 
        text-center sm:text-right 
        max-w-[220px] sm:max-w-none 
        leading-tight sm:leading-normal
      ">
        A agência das empresas que crescem com{" "}
        <span className="text-primary font-semibold block sm:inline">
          Inteligência Artificial
        </span>
      </p>
    </motion.header>
  );
};
