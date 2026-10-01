export type BusinessType = "products" | "services" | "both";
export type Business = { id:string; slug:string; name:string; subtitle:string|null; description:string|null; primary_color:string; accent_color:string; logo_url:string|null; type:BusinessType; whatsapp:string|null; business_hours:string|null; is_active:boolean; created_at?:string };
export type Category = { id:string; business_id:string; name:string; sort_order:number };
export type ItemVariant = { id:string; item_id:string; name:string; price:number|null };
export type CatalogItem = { id:string; business_id:string; category_id:string|null; name:string; description:string|null; price:number|null; duration_minutes:number|null; image_url:string|null; is_active:boolean; sort_order:number; category?:Category|null; variants?:ItemVariant[] };
export type CartLine = { item:CatalogItem; variant?:ItemVariant; qty:number };
