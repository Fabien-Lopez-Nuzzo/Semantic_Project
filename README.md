This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, clone this repository to your machine using the following command:

```bash
git clone https://github.com/Fabien-Lopez-Nuzzo/Semantic_Project.git
```

Then, proceed to enter the repository's directory on your machine.
Verify that Docker is [properly installed](https://docs.docker.com/engine/install/) and running on your machine.
Since we put the project in a Docker image, you only need one command to install all the needed dependencies and deploy it on your local browser end:

```bash
docker-compose up --build
# if running on a subsystem, you might need to execute it as a super-admin, using:
sudo docker-compose up --build
```

The project should be up and running in the matter of maximum **90 seconds**.
Open [http://localhost:10000](http://localhost:10000) with your browser to see the result.
Hit Ctrl+C when you want to terminate the local server and shut down the project.
Hit that again to force it to shut down immediately.

Enjoy.

---

## Learn More

To learn more about Next.js, you can take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

To learn more about the framework, you can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/).
