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
                  <h3 className="text-2xl font-bold text-primary-glow">Desenvolvido por</h3>
                  <h4 className="text-xl font-semibold text-white">Joab Henrique</h4>
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <GraduationCap className="w-4 h-4" />
                    <span>Graduando em Ciência da Computação</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-6">
                  <a 
                    href="mailto:jhms2@cin.ufpe.br" 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-all duration-300 hover:scale-105 border border-primary/30"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                  
                  <a 
                    href="https://linkedin.com/in/joab-henrique" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-all duration-300 hover:scale-105 border border-blue-600/30"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  
                  <a 
                    href="https://github.com/joab-henrique" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 rounded-lg hover:bg-gray-600/30 transition-all duration-300 hover:scale-105 border border-gray-600/30"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </div>
                
                <div className="pt-6 border-t border-primary/20">
                  <p className="text-sm text-gray-400 italic">
                    "Projeto desenvolvido com caráter exclusivamente pedagógico para apoiar 
                    o aprendizado na disciplina de Introdução à Programação - CIn UFPE"
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