const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

//implement a new service
class MessageService {
  constructor(){
    this.messages = [];
  }
  
  async create(data){ //data is object contains text of message
    const message = {
      id : this.messages.length,
      text : data.text
    }
    this.messages.push(message);
    return message;
  }
  
  async find(){
    return this.messages;
  }
  
}
const app = express(feathers());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.configure(express.rest());
app.configure(socketio());

app.use('/messages', new MessageService());
app.use(express.errorHandler());

app.on('connection', connection=>{
  app.channel('everybody').join(connection);
});

app.publish(()=> app.channel('everybody'));

app.listen(3030).on('listening',()=>{
  console.log('Chat server is listing on localhost 3030!')
})