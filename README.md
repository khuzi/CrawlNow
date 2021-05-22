# my_crawlnow

This is a Next.js project bootstrapped with create-next-app.

Getting Started
First, run the command in CMD 'npm install' to get all the node_module files.

Then, run the development server:

npm run dev
# or
yarn dev
Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying pages/index.js. The page auto-updates as you edit the file.

Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.
You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.

tech
Deployment On Vercel
Go to Vercel.com Login / SignUp Click on new project import from github click on deploy

Changes of Vercel link in app
first go to file /utils/methods/functios.js In rightUrl and in rightUrlSftp change remote property of url-object with vercel's app.

go to file /utils/authO.js add vercel's url in redirectUri