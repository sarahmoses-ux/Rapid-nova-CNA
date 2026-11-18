export type Program = { _id:string; name:string; slug:string; description:string; duration:string; format:string; tuitionMinor:number; curriculum:string[]; requirements:string[] };
export type Cohort = {_id:string; program:Program; startDate:string; endDate:string; schedule:string; location:string; capacity:number; enrolledCount:number; status:string};
let csrf = '';
export async function api<T>(path:string, options:RequestInit={}):Promise<T> {
  if(options.method && options.method!=='GET' && !csrf) { const r=await fetch('/api/auth/csrf',{credentials:'include'}); if(!r.ok) throw new Error('This request could not be completed. Please try again later.'); csrf=(await r.json()).data.token; }
  const res=await fetch(`/api${path}`,{...options,credentials:'include',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf,...options.headers}});
  const body=await res.json().catch(()=>({error:'This request could not be completed. Please try again later.'}));
  if(!res.ok) throw new Error(body.error||'Something went wrong. Please try again.'); return body.data as T;
}
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
export const date=(s:string)=>new Date(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
