/*
We create a server that handles publish/subscribe system. On getting hit from the publish button we call
publish method of the pubsusb class and send it to all the event listeners of subscribers
On Subscribe button we add event listeners to that particular topic and also return the list of subscribers uptil now
Notify function is used to notfify to the subscribers the publish made by the topic type
TECHNOLOGIES: Node.JS, Express
Created by: Saiyam Shah
*/
var myExpressInstance = require("express");
var myBodyParser = require("body-parser");
var path = require("path");
var app = myExpressInstance();
var app2 = myExpressInstance();
var request= require("request");
 //shell.exec(comandToExecute, {silent:true}).stdout;
 //you need little improvisation
 class PubSub {

   constructor() {
     // subscribers object have topics as keys
     // the values are arrays of listeners to call back upon publication
     this.subscribersList = {};
     this.subscribers = {};
     // history object will also have topics as keys
     // the values are arrays of messages to record history of published messages
     this.history = {};
   }

   /**
   * Handle '*' wildcard if included in topic.
   * @param {string} topic - the topic to subscribe to
   * @param {function} listener - the listener to call back when a message is published to a given topic
   * @param {number} numMessages - the number of messages (starting from most recent) to be delivered
   */


   /**
   * Subscribe a listener to a given topic.
   * @param {string} topic - the topic to subscribe to
   * @param {function} listener - the listener to call back when a message is published to a given topic
   * @param {number} numMessages - the number of messages (starting from most recent) to be delivered
   */

   subscribe(topic, listener, name, cb,numMessages = 1) {
     if (!this.subscribers[topic]) {
       this.subscribers[topic] = [];
       this.history[topic] = [];
       this.subscribersList[topic] = [];
     }
     var substatus;
     var check = this.subscribersList[topic].indexOf(name) > -1
     console.log(check);
        if(check==false)
        {
       this.subscribers[topic].push({ numMessages, listener });
       this.subscribersList[topic].push(name);
       substatus="success";
     }
     else {
       substatus="failure";
     }
 console.log("hey" +  this.subscribersList[topic]);
 cb(substatus,this.subscribersList[topic]);
   }


   unsubscribe(topic,name,cb)
   {
     var status;
     var index = this.subscribersList[topic].indexOf(name);
     if (index > -1) {
       this.subscribersList[topic].splice(index, 1);
       status="success";
     }
     else {
       status = "failure";
     }

     cb(status,this.subscribersList[topic]);
   }

   /**
   * Publish a message to a given topic.
   * @param {string} topic - the topic to publish a message to
   * @param {string} message - the message to be published to a given topic
   */

   publish(topic, message,cb) {
       var final = new Array();
       const subscribers = this.subscribers[topic];

       const history = this.history[topic];
       history.push(message);
       subscribers.forEach(subscriber => {
         const { listener, numMessages } = subscriber;
         const messages = history.slice(-numMessages);
         var output;
         var check=false;
        output = listener(messages);
        for(var i=0;i<this.subscribersList[topic].length;i++)
        {
          console.log(this.subscribersList[topic][i]);
          console.log(output);
          console.log(output.includes(this.subscribersList[topic][i]));
          if(output.includes(this.subscribersList[topic][i])==true)
          {
            console.log("here");
              check=true;
              break;
          }

        }
        if(check==true)
        final.push(output);

       });
         cb(final);

   }



      notify(topic, message,cb) {
          var final = new Array();
          const subscribers = this.subscribers[topic];

          const history = this.history[topic];
          history.push(message);
          subscribers.forEach(subscriber => {
            const { listener, numMessages } = subscriber;
            const messages = history.slice(-numMessages);
            var output;
            var check=false;
           output = listener(messages);
           for(var i=0;i<this.subscribersList[topic].length;i++)
           {
             console.log(this.subscribersList[topic][i]);
             console.log(output);
             console.log(output.includes(this.subscribersList[topic][i]));
             if(output.includes(this.subscribersList[topic][i])==true)
             {
               console.log("here");
                 check=true;
                 break;
             }

           }
           if(check==true)
           final.push(output);

          });
            cb(final);

      }









 }


const pubsub = new PubSub();



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(myBodyParser.json());                       //middleware to check the data
app.use(myBodyParser.urlencoded({extended: true}));
app.use(myExpressInstance.static(path.join(__dirname,'clients')));  //middleware to load the css contents  and jquery files
app.get('/',function(request,response)
{
response.render('index.ejs');

 //When you visit a website it is GET request
});


//Handling the main page
app.post('/publish', function (req, res) {

var type= req.body.result[0].type;
console.log(type);
if(type=="Publisher")
{
  pubsub.publish(req.body.result[0].option, req.body.result[0].text,function(id)
{
  res.setHeader('Content-Type', 'application/json');
  console.log(id);
  res.send(JSON.stringify({result: id}));

});

}

else if (type=="Subscriber") {
     var myArray=new Array();
  console.log("I am in subscriber");
  const listener1 = msg => {
//    console.log(req.body.result[0].name + ' : ' + msg);
    var op= req.body.result[0].name + ' has been notified about"' + msg + '"by topic ' + req.body.result[0].title;
    return op;
  }
  pubsub.subscribe(req.body.result[0].title, listener1, req.body.result[0].name,function(substatus,list)
{
  res.setHeader('Content-Type', 'application/json');
  console.log(list);
  var item={
    substatus: substatus,
    list: list
  }
  myArray.push(item);
  res.send(JSON.stringify({result: myArray}));
});
}

 else  {
 var myArray = new Array();
  console.log("I am in Unsubscriber");
  pubsub.unsubscribe(req.body.result[0].title, req.body.result[0].name,function(status,list)
{
  res.setHeader('Content-Type', 'application/json');
  var item={
    status: status,
    list: list
  }
  myArray.push(item);
  res.send(JSON.stringify({result: myArray}));
});


}


         })


app.listen(8003, function(){
console.log("Server is up and running and listening at port 8003");
});






//module.exports = PubSub;
