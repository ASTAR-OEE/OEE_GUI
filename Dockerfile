### STAGE 1: Build ###

FROM node:18-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./

RUN npm cache clean --force

RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build -- --output-path=dist/dist-template

# Copy Kendo license if applicable
COPY kendo-ui-license.txt ./
RUN npm install --save @progress/kendo-licensing && npx kendo-ui-license activate

### STAGE 2: Setup ###

# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the built Angular application to Nginx's html directory
COPY --from=builder /app/dist/dis-template /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
