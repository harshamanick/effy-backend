import express from'express';
import {companies} from '../Routes/companies.js';
import { users } from '../Routes/Users.js';
import cros from 'cors';
// const {route:users} = require('../Routes/Users');
export default function(App){
App.use(express.json());
App.use(cros());
App.use('/api/company',companies);
App.use('/api/user',users);
App.use('/api/all_users',users);
}