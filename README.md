# Publish-Subscribe
Dockerised Pub-Sub
The application is a demonstration of a Pub-Sub System that is deployed into a container that is inside Docker. The subscribers via their unique name can subscribe to various topics, This adds their event listeners just like a news system. The subscribers can subscribe and unsubscriber to any topic. A list is maintained for each topic with the subscribers. Publishers can publish content and this notifies all subscribers subscribed to that topic about the message that was sent just like a notification. This is a centralised form of Pub-Sub where the entire system is inside one Docker container
Getting Started
Copy the folder at an appropriate position
Prerequisites- System 
Install the following softwares before deployment 
1. Node.JS
2. Docker CE
3. Javascript Library
Deploying- Steps
1. Navigate to the folder where the project is copied through the command prompt
2. Run the following command 
docker build -t pubsub .
This will create an image from the dockerfile which will copy all the contents after downloading node. It will create image with the name pubsub
3. Run the following command
docker run -p 8000:8000 -d pubsub
This will get the server running by exposing the port 8000 on docker and then you will get the following message
"Server is up and running on port 8000"
4. Go to any browser and type the following
localhost:8000
You will see the website up and running 
Running the tests
Enter any name in the subscriber list, select a topic and add the subscriber
You will get a message "You have successfully subscribed" and you will also be able to see the list of subscribers for that topic
Select that topic and enter the content of the message and hit Publish
This will publish the message and notify the subscribers about the message
Built With
Node.js - Server
HTML, Javascript- Front end website
Docker - container
Versioning
We use Version2 , See Phase 1 for Version 1 and Phase 3 for Distributed PubSub
Authors
Saiyam Pravinchandra Shah - saiyampr@buffalo.edu
Acknowledgments
Docker- Documentation
Javascript - Documentation
Dr. Bina Ramamurthy
Arshad
Foad
Ali
Sixu
Ahmet
Saurav
Directory Structure
saiyampr_Project2_Phase2
- views	
	- indes.ejs
- package.json
- server.js
- Main.js
- Dockerfile
Readme.rtf
Screenshots


 

 





