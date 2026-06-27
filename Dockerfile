FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled code from Github Actions (dist folder)
COPY dist ./dist

# Expose port
EXPOSE 4000

# Start application
CMD ["npm", "start"]
