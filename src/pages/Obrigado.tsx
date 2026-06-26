import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/LeadForm/Header";

const Obrigado = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Header />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/20 rounded-full p-4">
                <CheckCircle2 className="text-primary" size={48} />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-3">
              Obrigado pelo contato!
            </h1>
            <p className="text-muted-foreground">
              Recebemos suas informações. Em breve entraremos em contato.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Obrigado;
