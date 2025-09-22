#!/bin/bash

# Script to set up Artifact Registry for the project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Setting up Artifact Registry${NC}"
echo ""

# Get current project
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No project set. Please run: gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}📋 Project ID: $PROJECT_ID${NC}"

# Enable Artifact Registry API
echo -e "${YELLOW}🔌 Enabling Artifact Registry API...${NC}"
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Registry repository
REPOSITORY_NAME="goal-tracker"
LOCATION="us"

echo -e "${YELLOW}📦 Creating Artifact Registry repository...${NC}"
gcloud artifacts repositories create $REPOSITORY_NAME \
    --repository-format=docker \
    --location=$LOCATION \
    --description="Docker repository for Goal Tracker application"

echo -e "${GREEN}✅ Artifact Registry repository created: $REPOSITORY_NAME${NC}"

# Configure Docker authentication
echo -e "${YELLOW}🔐 Configuring Docker authentication...${NC}"
gcloud auth configure-docker us-docker.pkg.dev

echo -e "${GREEN}✅ Docker authentication configured${NC}"

# Display repository information
echo ""
echo -e "${BLUE}📋 Repository Information:${NC}"
echo -e "${GREEN}Repository Name: $REPOSITORY_NAME${NC}"
echo -e "${GREEN}Location: $LOCATION${NC}"
echo -e "${GREEN}Full URL: us-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME${NC}"

echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Push your changes to GitHub"
echo "2. The workflow will now use Artifact Registry"
echo "3. Images will be pushed to: us-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME"
echo ""
echo -e "${GREEN}🎉 Artifact Registry setup complete!${NC}"
