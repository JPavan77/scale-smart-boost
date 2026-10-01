export type Variant = { name: string; price?: number };
export type CatalogItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price?: number;
  duration?: number;
  image: string;
  variants?: Variant[];
};

export const demoBusiness = {
  slug: "barbearia-do-ze",
  name: "Barbearia do Zé",
  subtitle: "Cortes, barba e cuidado sem enrolação.",
  description: "Atendimento de bairro com acabamento de respeito. Escolha seu serviço e mande o pedido pelo WhatsApp.",
  primary: "#294a41",
  accent: "#f4c96b",
  whatsapp: "5511999999999",
  hours: "Hoje até 19h",
  active: true,
};

export const demoItems: CatalogItem[] = [
  { id:"corte-classico", category:"Cortes", name:"Corte clássico", description:"Tesoura e máquina, acabamento e finalização.", price:45, duration:45, image:"https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80", variants:[{name:"Tradicional"},{name:"Degradê",price:55}] },
  { id:"corte-barba", category:"Combos", name:"Corte + barba", description:"Pacote completo para sair pronto.", price:75, duration:75, image:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80", variants:[{name:"Tradicional"},{name:"Com toalha quente",price:85}] },
  { id:"barba", category:"Barba", name:"Barba completa", description:"Desenho, acabamento e hidratação.", price:35, duration:30, image:"https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=900&q=80" },
  { id:"pezinho", category:"Cortes", name:"Acabamento", description:"Pezinho e contorno para segurar o corte por mais tempo.", price:20, duration:15, image:"https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80" },
  { id:"sob-consulta", category:"Especiais", name:"Dia do noivo", description:"Atendimento especial com horário reservado e preparação completa.", duration:120, image:"https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80" }
];
