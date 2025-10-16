// VLUMA Theme Configuration
// Cores e estilos alinhados com o site principal da VLUMA

export const vlumaTheme = {
  colors: {
    // Cores principais VLUMA (do site)
    'purple-vivid': '#8B5CF6',
    'blue-vivid': '#3B82F6',
    'cyan-vivid': '#06B6D4',
    'pink-vivid': '#EC4899',
    'verde-inteligente': '#10B981',
    'laranja-cta': '#EA580C',
    
    // Backgrounds
    'fundo-escuro': '#000000',
    'card-dark': '#0A0A0A',
    'card-darker': '#050505',
    
    // Textos
    'branco-puro': '#FFFFFF',
    'branco-suave': '#F8FAFC',
    'cinza-claro': '#94A3B8',
    'cinza-medio': '#64748B',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
    secondary: 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
    hero: 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #1A0A14 100%)',
    card: 'linear-gradient(135deg, #0A0A0A 0%, #0F0A14 100%)',
    button: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
    purpleToCyan: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    background: 'linear-gradient(to bottom right, #000000 0%, #0A0A0A 50%, #0F1419 100%)',
  },
  
  fonts: {
    family: 'Inter, system-ui, -apple-system, sans-serif',
  },
  
  shadows: {
    glow: '0 0 40px rgba(139, 92, 246, 0.3)',
    glowCyan: '0 0 40px rgba(6, 182, 212, 0.3)',
    glowPink: '0 0 40px rgba(236, 72, 153, 0.3)',
    card: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
};

export type VlumaTheme = typeof vlumaTheme;
