'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 admin.initializeApp({
credential: admin.credential.applicationDefault(),
  databaseURL:'ws://pizza-ordering-owohtr.firebaseio.com//'
   }); 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
 //for fetching order from database.
  function handlenoofpizzano(agent){
   return admin.database().ref('order/mobile_no').once("value").then((snapshot) => {
  const value = snapshot.child('noofpizza').val();
    const value1 = snapshot.child('custsize').val(); 
     const value2 = snapshot.child ('vegpizzatype').val();
    const value3 = snapshot.child ('toppingtype').val();
     const value4 = snapshot.child ('crusttype').val();
    
     
  if(value !== null){
 
    agent.add('Here is your order:      ' + value + '  ' + value1 + ' ' + value2 + ' '+'pizza' + ' ' + 'having' + ' ' + value3 + ' ' +'with' + ' ' + value4 +' '+ 'crust');
   agent.add('Could you pls confirm the order.');
  }
     
   });
  }
  
  
  
  
   function handlename(agent){
  const text = agent.parameters.name;
     
   return admin.database().ref('order/mobile_no').update({
   name: text
   
 });
 }
   function handlemobile_no(agent){
  const number = agent.parameters.number;  
     
   return admin.database().ref('order').push({
   mobile_no: number
   
 });
 }
  function handleaddress(agent){
   const locat = agent.context.location;
   // return admin.database().ref('order').push({name: name}).then((snapshot) => {
        
    return admin.database().ref('order/mobile_no').update({address : locat}).then((snapshot) => {
  const value = snapshot.child('custsize').val();
    
  if(value !== null){
 
    agent.add('Awesome your order is placed.......and your order no is:' + value);
  }      
         

   
 });
 }
  
  function handlevegpizzatype(agent){
  const text = agent.parameters.text;
   return admin.database().ref('order/mobile_no').update({
   vegpizzatype: text
     

 });
 }

 
  

  function handlenonvegtype(agent){
  const nonveg = agent.parameters.nonveg;
    //const context = agent.getContext('awaiting_name_confirm');   
   return admin.database().ref('order/mobile_no').update({
   nonvegtype: nonveg
  
 });
 }
  function handlecustsize(agent){
  const size = agent.parameters.size;
     
   return admin.database().ref('order/mobile_no').update({
   custsize: size
   
 });
 }

  function handletoppingtype(agent){
  const text = agent.parameters.text;
     
   return admin.database().ref('order/mobile_no').update({
   toppingtype: text
   
 });
 }
  function handlecrusttype(agent){
  const text = agent.parameters.text;
     
   return admin.database().ref('order/mobile_no').update({
   crusttype: text
   
 });
 } 
  
let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
 intentMap.set('savetodb', handlesavetodb);
  //intentMap.set('readfromdb', handlereadfromdb);
 intentMap.set('mobile_no', handlemobile_no);
  intentMap.set('vegpizzatype', handlevegpizzatype);
 intentMap.set('custsize', handlecustsize);
intentMap.set('address', handleaddress);
  intentMap.set('name', handlename);
  intentMap.set('nonvegtype', handlenonvegtype);
  
  intentMap.set('toppingtype', handletoppingtype);
 intentMap.set('crusttype', handlecrusttype);
  intentMap.set('noofpizzano', handlenoofpizzano);
  agent.handleRequest(intentMap);
});

