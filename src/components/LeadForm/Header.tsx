import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        backdrop-blur-sm border border-border rounded-2xl p-4 mb-8 
        flex flex-col sm:flex-row items-center justify-between gap-4 
        shadow-xl bg-white/80" 
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
        <img 
          src={logo} 
          alt="B2BFlow" 
          className="h-10 w-10 rounded-lg object-cover shadow-sm" 
        />
        <span className="font-bold text-xl text-black">
          B2b<span className="text-primary">Flow</span>
        </span>
      </div>

      {/* Texto com quebra forçada apenas no lugar certo */}
      <p className="
        text-sm sm:text-base
        text-black/80
        text-center sm:text-right 
        max-w-[320px] sm:max-w-none 
        leading-tight sm:leading-normal
      ">
        <span className="inline-block sm:inline">A agência das empresas que crescem com</span>{" "}
        <span className="text-primary font-bold block sm:inline whitespace-nowrap">
          Inteligência Artificial
        </span>
      </p>
    </motion.header>
  );
};