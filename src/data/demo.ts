import type { Business, Category, CatalogItem } from "../lib/types";
export const demoBusiness: Business = { id:"demo-business", slug:"barbearia-do-ze", name:"Barbearia do Zé", subtitle:"Cortes, barba e cuidado sem enrolação.", description:"Atendimento de bairro com acabamento de respeito. Escolha seu serviço e envie o pedido pelo WhatsApp.", primary_color:"#294a41", accent_color:"#f4c96b", logo_url:null, type:"services", whatsapp:"5511999999999", business_hours:"Hoje até 19h", is_active:true };
export const demoCategories: Category[] = [
 {id:"cat-cortes",business_id:demoBusiness.id,name:"Cortes",sort_order:1},
 {id:"cat-barba",business_id:demoBusiness.id,name:"Barba",sort_order:2},
 {id:"cat-combos",business_id:demoBusiness.id,name:"Combos",sort_order:3},
 {id:"cat-especiais",business_id:demoBusiness.id,name:"Especiais",sort_order:4}
];
export const demoItems: CatalogItem[] = [
 {id:"corte",business_id:demoBusiness.id,category_id:"cat-cortes",name:"Corte clássico",description:"Tesoura e máquina, acabamento e finalização.",price:45,duration_minutes:45,image_url:"https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",is_active:true,sort_order:1,category:demoCategories[0],variants:[{id:"v1",item_id:"corte",name:"Tradicional",price:null},{id:"v2",item_id:"corte",name:"Degradê",price:55}]},
 {id:"combo",business_id:demoBusiness.id,category_id:"cat-combos",name:"Corte + barba",description:"Pacote completo para sair pronto.",price:75,duration_minutes:75,image_url:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",is_active:true,sort_order:2,category:demoCategories[2],variants:[{id:"v3",item_id:"combo",name:"Tradicional",price:null},{id:"v4",item_id:"combo",name:"Toalha quente",price:85}]},
 {id:"barba",business_id:demoBusiness.id,category_id:"cat-barba",name:"Barba completa",description:"Desenho, acabamento e hidratação.",price:35,duration_minutes:30,image_url:"https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=900&q=80",is_active:true,sort_order:3,category:demoCategories[1],variants:[]},
 {id:"acabamento",business_id:demoBusiness.id,category_id:"cat-cortes",name:"Acabamento",description:"Pezinho e contorno para segurar o corte por mais tempo.",price:20,duration_minutes:15,image_url:"https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80",is_active:true,sort_order:4,category:demoCategories[0],variants:[]},
 {id:"noivo",business_id:demoBusiness.id,category_id:"cat-especiais",name:"Dia do noivo",description:"Atendimento especial com horário reservado e preparação completa.",price:null,duration_minutes:120,image_url:"https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",is_active:true,sort_order:5,category:demoCategories[3],variants:[]}
];
