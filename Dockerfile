FROM node:14

WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 8000

# Use nodemon for development
CMD ["npm", "run", "dev"]
