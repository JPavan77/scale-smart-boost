export function money(value:number|null|undefined){ return value == null ? "Sob consulta" : value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }
export function slugify(value:string){ return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); }
export function digits(value:string){ return value.replace(/\D/g,""); }
