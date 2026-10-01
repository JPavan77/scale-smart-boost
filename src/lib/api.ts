import { catalogBucket, cloudConfigured, supabase } from "./supabase";
import type { Business, Category, CatalogItem, ItemVariant } from "./types";
import { demoBusiness, demoCategories, demoItems } from "../data/demo";
export async function getPublicCatalog(slug:string):Promise<{business:Business;categories:Category[];items:CatalogItem[]}|null>{
 if(!supabase){ return slug===demoBusiness.slug?{business:demoBusiness,categories:demoCategories,items:demoItems}:null; }
 const {data:business,error}=await supabase.from("businesses").select("*").eq("slug",slug).eq("is_active",true).maybeSingle();
 if(error) throw error; if(!business) return null;
 const [{data:categories,error:catError},{data:items,error:itemError}]=await Promise.all([
   supabase.from("categories").select("*").eq("business_id",business.id).order("sort_order"),
   supabase.from("items").select("*, category:categories(*), variants:item_variants(*)").eq("business_id",business.id).eq("is_active",true).order("sort_order")
 ]);
 if(catError) throw catError; if(itemError) throw itemError; return {business:business as Business,categories:(categories??[]) as Category[],items:(items??[]) as CatalogItem[]};
}
export async function getBusinesses():Promise<Business[]>{ if(!supabase) return [demoBusiness]; const {data,error}=await supabase.from("businesses").select("*").order("created_at",{ascending:false}); if(error)throw error; return (data??[]) as Business[]; }
export async function getBusiness(id:string):Promise<Business|null>{ if(!supabase) return id===demoBusiness.id?demoBusiness:null; const {data,error}=await supabase.from("businesses").select("*").eq("id",id).maybeSingle(); if(error)throw error; return data as Business|null; }
export async function getOwnedBusiness(ids:string[]):Promise<Business|null>{ if(!supabase) return demoBusiness; if(!ids.length)return null; const {data,error}=await supabase.from("businesses").select("*").in("id",ids).order("created_at").limit(1).maybeSingle(); if(error)throw error; return data as Business|null; }
export async function getCatalogAdminData(businessId:string){ if(!supabase) return {categories:demoCategories,items:demoItems}; const [{data:categories,error:ce},{data:items,error:ie}]=await Promise.all([supabase.from("categories").select("*").eq("business_id",businessId).order("sort_order"),supabase.from("items").select("*, category:categories(*), variants:item_variants(*)").eq("business_id",businessId).order("sort_order")]); if(ce)throw ce;if(ie)throw ie;return {categories:(categories??[]) as Category[],items:(items??[]) as CatalogItem[]}; }
export async function saveBusiness(input:Partial<Business>&{name:string;slug:string}){ if(!supabase) return {...demoBusiness,...input}; if(input.id){ const {data,error}=await supabase.from("businesses").update(input).eq("id",input.id).select().single(); if(error)throw error; return data as Business; } const {data,error}=await supabase.from("businesses").insert(input).select().single(); if(error)throw error; return data as Business; }
export async function toggleBusiness(id:string,is_active:boolean){ if(!supabase)return; const {error}=await supabase.from("businesses").update({is_active}).eq("id",id); if(error)throw error; }
export async function saveCategory(input:Partial<Category>&{business_id:string;name:string}){ if(!supabase)return; const query=input.id?supabase.from("categories").update(input).eq("id",input.id):supabase.from("categories").insert(input); const {error}=await query; if(error)throw error; }
export async function deleteCategory(id:string){ if(!supabase)return; const {error}=await supabase.from("categories").delete().eq("id",id); if(error)throw error; }
export async function saveItem(input:Partial<CatalogItem>&{business_id:string;name:string},variants:{name:string;price:number|null}[]){
 if(!supabase)return;
 const {error}=await supabase.rpc("save_catalog_item",{
   _id: input.id??null,
   _business_id: input.business_id,
   _name: input.name,
   _description: input.description??"",
   _price: input.price??null,
   _duration_minutes: input.duration_minutes??null,
   _category_id: input.category_id??null,
   _image_url: input.image_url??"",
   _is_active: input.is_active??true,
   _sort_order: input.sort_order??0,
   _variants: variants
 });
 if(error)throw error;
}
export async function deleteItem(id:string){ if(!supabase)return; const {error}=await supabase.from("items").delete().eq("id",id); if(error)throw error; }
export async function uploadCatalogImage(file:File,businessId:string){ if(!supabase) return URL.createObjectURL(file); const ext=file.name.split(".").pop()||"jpg"; const path=businessId+"/"+crypto.randomUUID()+"."+ext; const {error}=await supabase.storage.from(catalogBucket).upload(path,file,{upsert:false}); if(error)throw error; const {data}=supabase.storage.from(catalogBucket).getPublicUrl(path); return data.publicUrl; }
export async function inviteOwner(businessId:string,email:string){ if(!supabase) return {demo:true}; const {data,error}=await supabase.functions.invoke("invite-business-owner",{body:{businessId,email}}); if(error)throw error; return data; }
export { cloudConfigured };
