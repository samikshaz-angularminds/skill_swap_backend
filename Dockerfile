# Use an official Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Start the app
CMD ["npm", "start"]

# Expose the app's port (if needed)
EXPOSE 5000
