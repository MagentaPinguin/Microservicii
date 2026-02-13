SOA Project

In a perfect world where everything works on the first try and nothing crashes mysteriously… </br>
This project is an attempt to use microservices hosted in Docker containers. The project launches multiple instances of the containers, while routing and load balancing are handled by Nginx.

After running the docker-compose file, executing the command from load_balancer_test.txt in the terminal will print the output of a ./health request provided by the auth service instances, each proudly announcing its own name.

God help me ant the one who reads this. 🐄