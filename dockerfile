# Step 1: Use an official Node.js runtime as a base image
FROM node:20

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the application port (3000)
EXPOSE 3000

# Step 7: Run the application
CMD ["npm", "start"]
