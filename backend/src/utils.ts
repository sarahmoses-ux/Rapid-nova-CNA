import crypto from 'node:crypto';
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
export const id=(prefix:string)=>`${prefix}-${crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase()}`;
export const hash=(s:string)=>crypto.createHash('sha256').update(s).digest('hex');
export function safeEqual(a:unknown,b:unknown){if(typeof a!=='string'||typeof b!=='string')return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)}
export function attendanceSummary(records:{status:string;verifiedMinutes:number}[]){const present=records.filter(r=>['Present','Late'].includes(r.status)).length;return {sessions:records.length,attendancePercent:records.length?Math.round(present/records.length*100):0,verifiedMinutes:records.reduce((n,r)=>n+r.verifiedMinutes,0)}}
export function scoreExam(questions:{correctIndex:number;options:string[];explanation?:string|null}[],answers:number[]){if(answers.length!==questions.length||answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=questions[i].options.length))throw new HttpError(400,'Answer every question with a valid option.');return {score:questions.reduce((n,q,i)=>n+(q.correctIndex===answers[i]?1:0),0),total:questions.length,explanation:questions.map(q=>q.explanation||'')}}
export function safeCsvCell(value:unknown){const s=String(value??'');return `"${(/^[=+@\-\t\r]/.test(s)?"'":'')+s.replaceAll('"','""')}"`}
