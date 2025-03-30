docker build -t node-docker .

<!-- Both --tag and -t are the same. The -t flag is just a shorthand for --tag.
This command builds a Docker image with the name node-docker using the current directory (.) as the build context. -->

Docker Image (node-docker) → A template for creating containers.
Docker Container → A running instance of the image.

<!-- First 3000 (Host Machine Port): The port on your local machine (host).
Second 3000 (Container Port): The port inside the Docker container.
node-docker is image which we have created using the tag flag
-->

docker run --name my-container-name -p 8080:8080 node-docker

docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest

<!--
-d → Runs the container in the background (detached mode).

--name mongodb → Names the container "mongodb".

-p 27017:27017 → Maps MongoDB's default port 27017 to your local machine.

-v mongodb_data:/data/db → Creates a Docker volume (mongodb_data) to persist the database.

mongo:latest → Uses the latest official MongoDB image.
-->
