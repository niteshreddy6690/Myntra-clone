# Use an official Node.js runtime as the base image
FROM node:18-alpine


# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./  


# Copy the rest of the application code
COPY . . 

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]