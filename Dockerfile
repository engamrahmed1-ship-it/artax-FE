# Stage 1: Build the React application
# Assuming you are using a standard Node.js environment for building
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
# Replace 'npm run build' with your actual build command if different
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine as production

# Copy the custom Nginx configuration file
# This file contains the server block for crm.artax-group.com
COPY default.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built React application files from the build stage
# The 'build' directory is the default output for 'create-react-app'
# Adjust '/app/build' if your build output directory is different (e.g., 'dist')
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
