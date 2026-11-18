import type{Request,Response,NextFunction}from'express';
import {User,Cohort,Enrollment,AuditLog}from'../models/index.js';
import {HttpError,safeEqual}from'../utils.js';
declare module 'express-session'{interface SessionData{userId:string;csrf:string}}
declare module 'express-serve-static-core'{interface Request{user?:{_id:any;firstName:string;lastName:string;email:string;role:string}}}
export async function authenticate(req:Request,_res:Response,next:NextFunction){try{if(!req.session.userId)throw new HttpError(401,'Please sign in to continue.');const u=await User.findById(req.session.userId).select('firstName lastName email role active');if(!u?.active)throw new HttpError(401,'This account is unavailable.');req.user=u as any;next()}catch(e){next(e)}}
export const allow=(...roles:string[])=>(req:Request,_res:Response,next:NextFunction)=>{if(!req.user||!roles.includes(req.user.role))return next(new HttpError(403,'Your account does not have permission for this action.'));next()};
export function csrf(req:Request,_res:Response,next:NextFunction){if(['GET','HEAD','OPTIONS'].includes(req.method))return next();const origin=req.get('origin');if(origin&&origin!==process.env.FRONTEND_ORIGIN)return next(new HttpError(403,'Request origin is not allowed.'));if(!safeEqual(req.get('X-CSRF-Token'),req.session.csrf))return next(new HttpError(403,'Your security token has expired. Reload this page and try again.'));next()}
export async function assignedCohort(req:Request,cohortId:string){if(['super_admin','administrator'].includes(req.user!.role))return;const c=await Cohort.findOne({_id:cohortId,instructor:req.user!._id});if(!c)throw new HttpError(403,'This cohort is not assigned to you.')}
export async function enrolled(req:Request,cohortId:string){const e=await Enrollment.exists({student:req.user!._id,cohort:cohortId,status:{$in:['Enrolled','Active','Completed']}});if(!e)throw new HttpError(403,'This course is not assigned to your account.')}
export async function audit(req:Request,action:string,resource:string,resourceId:string,changes?:unknown){await AuditLog.create({actor:req.user!._id,action,resource,resourceId,changes})}
