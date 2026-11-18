import mongoose from'mongoose';
import {createApp}from'./app.js';
if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is required. Copy .env.example to .env and configure it.');
if((process.env.SESSION_SECRET?.length||0)<32)throw new Error('SESSION_SECRET must contain at least 32 characters.');
if(process.env.NODE_ENV==='production'&&(!process.env.FRONTEND_ORIGIN?.startsWith('https://')||!process.env.PUBLIC_BASE_URL?.startsWith('https://')))throw new Error('Production requires HTTPS frontend URLs.');
await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
await Promise.all(Object.values(mongoose.models).map(m=>m.init()));
const server=createApp().listen(Number(process.env.PORT)||4000,'127.0.0.1',()=>console.log(`Academy API listening on http://127.0.0.1:${process.env.PORT||4000}`));
async function shutdown(){server.close();await mongoose.disconnect();process.exit(0)}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
