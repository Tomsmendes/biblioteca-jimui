
import React from 'react';
import { APP_INFO, COLORS } from '../constants';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#0F9D58] p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-6 overflow-hidden">
  <img 
    src="/biblioteca-jimui/logo.jpeg" 
    alt="Logo JIMUA" 
    className="w-full h-full object-cover"
  />
</div>

            <h2 className="text-4xl font-black mb-2">{APP_INFO.name}</h2>
            <p className="text-green-100 font-medium opacity-90">Versão {APP_INFO.version}</p>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <section>
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">01</span>
              Nossa Missão
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {APP_INFO.purpose}
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">02</span>
                Como Funciona?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2">
                  <span className="text-[#0F9D58] font-bold">•</span>
                  <span><strong>Busca:</strong> Encontre livros por título ou categoria.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0F9D58] font-bold">•</span>
                  <span><strong>Offline:</strong> Baixe livros para ler sem internet.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0F9D58] font-bold">•</span>
                  <span><strong>Favoritos:</strong> Guarde o que mais gosta.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0F9D58] font-bold">•</span>
                  <span><strong>IA:</strong> Resumos automáticos feitos por IA.</span>
                </li>
              </ul>
            </section>

            <section className="bg-orange-50/30 p-6 rounded-3xl border border-orange-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">03</span>
                Créditos
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 font-bold">Criado por:</p>
                <p className="text-[#FF9800] font-black text-xl">{APP_INFO.creator}</p>
                <p className="text-gray-500 text-sm mt-4">
                  Desenvolvido com carinho para fortalecer a cultura e educação da nossa comunidade.
                </p>
              </div>
            </section>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm italic">
              "A leitura é para o intelecto o que o exercício é para o corpo."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
