import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Play, BookOpen, Users, Mail, Github, Star, Zap, Trophy, Target } from "lucide-react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const Index = () => {
  const scrollToLanguages = () => {
    document.getElementById('languages')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-glow rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-python rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-java rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="animate-pulse-glow">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-neon border-4 border-primary-glow">
                  <img 
                    src="/favicon.ico" 
                    alt="Ícone" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text text-transparent">
                CIn<span className="text-primary-glow animate-pulse">troduza</span>
              </h1>
            </div>
            <div className="text-xl md:text-2xl mb-8 font-bold">🎮 Gaming Edition 🎮</div>
            
            <div className="mb-12">
              <p className="text-xl md:text-2xl font-bold text-white mb-4">
                Transforme programação em diversão!
              </p>
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
                <strong>Domine a lógica de programação</strong> de algoritmos básicos, laços, listas e muito mais 
                através de desafios gamificados criados especialmente para 
                <strong> Introdução à Programação do CIn-UFPE</strong>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary-glow" />
                <div className="font-semibold">Sistema de Níveis</div>
                <div className="text-gray-300">Progrida do básico ao avançado</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Star className="w-8 h-8 mx-auto mb-2 text-primary-glow" />
                <div className="font-semibold">Sistema XP (em breve)</div>
                <div className="text-gray-300">Ganhe pontos a cada desafio</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Zap className="w-8 h-8 mx-auto mb-2 text-primary-glow" />
                <div className="font-semibold">Feedback Instantâneo (em breve)</div>
                <div className="text-gray-300">Aprenda com seus erros</div>
              </div>
            </div>
            
            <Button 
              onClick={scrollToLanguages}
              variant="gaming" 
              size="lg" 
              className="text-xl px-12 py-6 rounded-xl"
            >
              <div className="animate-pulse flex items-center">
                <Play className="mr-3 w-6 h-6" />
                  Começar Aventura! 🚀
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Opções de Linguagem */}
      <section id="languages" className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-5xl font-bold mb-4 text-foreground">🎯 Escolha sua Arma</h2>
            <p className="text-xl text-muted-foreground">Selecione a linguagem para começar sua jornada épica</p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
              {/* Python - Funcionando */}
              <Link to="/python" className="group">
                <Card className="cursor-pointer hover:shadow-neon transition-all duration-500 border-python bg-gradient-python text-white transform hover:scale-110 hover:-translate-y-2 animate-slide-up">
                  <CardHeader className="text-center relative">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-glow group-hover:animate-pulse-glow">
                      <div className="text-3xl">🐍</div>
                    </div>
                    <CardTitle className="text-3xl font-bold">Python</CardTitle>
                    <CardDescription className="text-python-foreground/90 font-semibold">
                      ✅ Disponível Agora!
                    </CardDescription>
                    <div className="absolute -top-2 -right-2 bg-success rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-xs">🔥</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-sm font-medium">6 Níveis Épicos</div>
                      <div className="text-xs opacity-80">Algoritmos Básicos até Recursão</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Java - Em Breve */}
              <Card className="opacity-60 cursor-not-allowed relative overflow-hidden group animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="absolute inset-0 bg-gradient-java opacity-20"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
                    <div className="text-3xl">☕</div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-muted-foreground">Java</CardTitle>
                  <CardDescription>Em Breve...</CardDescription>
                  <div className="absolute inset-0 flex items-center justify-center top-20">
                  <div className="bg-black/70 text-white font-bold text-lg px-6 py-2 rounded-lg border-2 border-yellow-400 -rotate-12 shadow-lg">
                    EM BREVE
                  </div>
                </div>
                </CardHeader>
              </Card>

              {/* C - Em Breve */}
              <Card className="opacity-60 cursor-not-allowed relative overflow-hidden group animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="absolute inset-0 bg-gradient-c opacity-20"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
                    <div className="text-3xl">⚡</div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-muted-foreground">C++</CardTitle>
                  <CardDescription>Em Breve...</CardDescription>
                  <div className="absolute inset-0 flex items-center justify-center top-20">
                  <div className="bg-black/70 text-white font-bold text-lg px-6 py-2 rounded-lg border-2 border-yellow-400 -rotate-12 shadow-lg">
                    EM BREVE
                  </div>
                </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o CIn */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8 text-white">
              🏛️ Centro de Informática - UFPE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <Card className="p-8 bg-primary/10 border-primary/30 backdrop-blur-sm hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <BookOpen className="w-10 h-10 text-primary-glow mb-4" />
                  <CardTitle className="text-white text-2xl">📚 Introdução à Programação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    A disciplina fundamental que forma a base de toda sua jornada em computação. 
                    Aqui você desenvolve o pensamento lógico e algorítmico essencial para se tornar 
                    um programador de elite! 🚀
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 bg-primary/10 border-primary/30 backdrop-blur-sm hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary-glow mb-4" />
                  <CardTitle className="text-white text-2xl">🎓 Centro de Informática</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Reconhecido nacionalmente pela excelência em ensino e pesquisa, o CIn-UFPE 
                    forma os melhores profissionais em computação do Brasil. Tradição, inovação 
                    e qualidade em cada linha de código! 💻✨
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gaming Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-gaming bg-clip-text text-transparent">
              🎮 Recursos Épicos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-card hover:shadow-neon transition-all duration-300 hover:scale-105 border-2 border-primary/20">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto animate-pulse-glow">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Desafios Livres</h3>
                  <p className="text-sm text-muted-foreground">Resolva qualquer desafio, sem restrições ou ranking públicos.</p>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-gradient-card hover:shadow-neon transition-all duration-300 hover:scale-105 border-2 border-python/20">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-python rounded-2xl flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Aprendizado</h3>
                  <p className="text-sm text-muted-foreground">Foque apenas em aprender, sem badges ou conquistas públicas.</p>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-gradient-card hover:shadow-neon transition-all duration-300 hover:scale-105 border-2 border-java/20">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-java rounded-2xl flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Desafios Diários</h3>
                  <p className="text-sm text-muted-foreground">Desafios pensados para você manter o ritmo diariamente!</p>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-gradient-card hover:shadow-neon transition-all duration-300 hover:scale-105 border-2 border-c-lang/20">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-c rounded-2xl flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Boss Battles</h3>
                  <p className="text-sm text-muted-foreground">Desafios épicos disponíveis a qualquer momento!</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;