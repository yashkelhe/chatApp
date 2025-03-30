FROM node:20.15.0

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (to optimize caching)
# ./ (dot-slash) → This refers to the current working directory inside the container.
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other files (including index.js)
COPY . .

# Expose port (adjust if your backend uses a different port)
EXPOSE 8080

# Run the application
CMD ["node", "index.js"]
