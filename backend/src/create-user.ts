import mongoose from'mongoose';
import bcrypt from'bcryptjs';
import {authenticator}from'otplib';
import {createInterface}from'node:readline/promises';
import {stdin as input,stdout as output}from'node:process';
import {z}from'zod';
import {User,roles}from'./models/index.js';
const rl=createInterface({input,output});
const email=z.email().parse(await rl.question('Account email: '));
const firstName=z.string().min(1).parse(await rl.question('First name: '));
const lastName=z.string().min(1).parse(await rl.question('Last name: '));
const role=z.enum(roles).parse(await rl.question(`Role (${roles.join(', ')}): `));
// Read the initial password from the environment; never echo it or put it in command arguments.
const password=z.string().min(12).parse(process.env.INITIAL_USER_PASSWORD);
const secret=role==='student'?undefined:authenticator.generateSecret();
if(secret){output.write(`Enroll this URI privately in the staff authenticator; do not share it:\n${authenticator.keyuri(email,'Rapid Novid CNA',secret)}\n`);const code=await rl.question('Verify authenticator code: ');if(!authenticator.check(code,secret))throw new Error('Authenticator verification failed.')}
await mongoose.connect(process.env.MONGODB_URI!);await User.create({email,firstName,lastName,role,passwordHash:await bcrypt.hash(password,12),mfaSecret:secret});console.log('Account created. Clear INITIAL_USER_PASSWORD from your environment.');rl.close();await mongoose.disconnect();
