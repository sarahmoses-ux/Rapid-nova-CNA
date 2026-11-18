import {describe,it,expect}from'vitest';
import request from'supertest';
import {createApp}from'../app.js';
import {attendanceSummary,scoreExam,safeEqual,safeCsvCell}from'../utils.js';
const app=createApp({test:true});
describe('public API security boundaries',()=>{
it('exposes health without inventing database connectivity',async()=>{const r=await request(app).get('/api/health');expect(r.status).toBe(200);expect(r.body.data.database).toBe('unavailable')});
it('requires a CSRF token for public mutations',async()=>{const r=await request(app).post('/api/applications').send({});expect(r.status).toBe(403)});
it('rejects unauthenticated student and staff reads',async()=>{for(const path of ['/student/grades','/admin/students','/instructor/attendance']){const r=await request(app).get(`/api${path}`);expect(r.status).toBe(401)}});
it('validates applications before querying the database',async()=>{const agent=request.agent(app);const csrf=await agent.get('/api/auth/csrf');const r=await agent.post('/api/applications').set('X-CSRF-Token',csrf.body.data.token).send({firstName:''});expect(r.status).toBe(400);expect(r.body.error).toContain('firstName')});
it('rejects CSRF requests from another origin',async()=>{const agent=request.agent(app);const csrf=await agent.get('/api/auth/csrf');const r=await agent.post('/api/contact').set('X-CSRF-Token',csrf.body.data.token).set('Origin','https://untrusted.example').send({});expect(r.status).toBe(403)});
it('does not offer public administrator registration',async()=>{const agent=request.agent(app);const csrf=await agent.get('/api/auth/csrf');const r=await agent.post('/api/auth/register').set('X-CSRF-Token',csrf.body.data.token).send({role:'super_admin'});expect(r.status).toBe(404)});
it('fails closed when test payments are not configured',async()=>{const r=await request(app).post('/api/payments/stripe/webhook').set('Content-Type','application/json').send('{}');expect(r.status).toBe(503)});
});
describe('educational record calculations',()=>{
it('calculates attendance and verified minutes independently',()=>{expect(attendanceSummary([{status:'Present',verifiedMinutes:120},{status:'Late',verifiedMinutes:90},{status:'Absent',verifiedMinutes:0},{status:'Excused',verifiedMinutes:0}])).toEqual({sessions:4,attendancePercent:50,verifiedMinutes:210})});
it('handles empty attendance without a fabricated percentage',()=>expect(attendanceSummary([])).toEqual({sessions:0,attendancePercent:0,verifiedMinutes:0}));
it('grades practice questions and supplies explanations',()=>{const q=[{options:['a','b'],correctIndex:1,explanation:'Because b'},{options:['a','b'],correctIndex:0,explanation:'Because a'}];expect(scoreExam(q,[1,1])).toEqual({score:1,total:2,explanation:['Because b','Because a']});expect(()=>scoreExam(q,[9,0])).toThrow();expect(()=>scoreExam(q,[1])).toThrow()});
it('rejects missing, unequal, and differently sized security tokens',()=>{expect(safeEqual('a','a')).toBe(true);expect(safeEqual('a','b')).toBe(false);expect(safeEqual('a','aa')).toBe(false);expect(safeEqual(undefined,'a')).toBe(false)});
it('escapes CSV formula injection and quotation marks',()=>{expect(safeCsvCell('=SUM(A1:A2)')).toBe('"\'=SUM(A1:A2)"');expect(safeCsvCell('a"b')).toBe('"a""b"')});
});
