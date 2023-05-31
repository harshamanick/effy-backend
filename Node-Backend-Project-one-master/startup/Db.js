import mongoose from "mongoose";
mongoose.set('strictQuery',true);
export default function(){
    mongoose.connect('mongodb://harsha:harsha@ac-wmb8r1n-shard-00-00.wwgnp1f.mongodb.net:27017,ac-wmb8r1n-shard-00-01.wwgnp1f.mongodb.net:27017,ac-wmb8r1n-shard-00-02.wwgnp1f.mongodb.net:27017/?replicaSet=atlas-a0vhns-shard-0&ssl=true&authSource=admin').then(result=>{
    console.log('connected.....');
}).catch(err=>{
    console.log('error....',err);
});
}
