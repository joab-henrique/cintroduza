import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, GraduationCap, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-dark text-white py-12 border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-white">Desenvolvido pela</h4>
                  <h3 className="text-2xl font-bold text-primary-glow">Monitoria de IP</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <span>Com muito carinho ❤</span>
                  </div>
                </div>
            
                <div className="pt-6 border-t border-primary/20">
                  <p className="text-sm text-gray-400 italic">
                    Projeto desenvolvido com caráter exclusivamente pedagógico para apoiar 
                    o aprendizado na disciplina de Introdução à Programação - CIn UFPE
                  </p>
                </div>
                
                <div className="text-xs text-gray-500">
                  © 2025 CIntroduza - Gaming Edition. Todos os direitos reservados.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </footer>
  );
};

export default Footer;