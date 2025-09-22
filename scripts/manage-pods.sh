#!/bin/bash

# Pod Management Script for Goal Tracker

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show help
show_help() {
    echo "Goal Tracker Pod Management"
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  status [namespace]     - Show pod status"
    echo "  scale [namespace] [app] [replicas] - Scale pods"
    echo "  logs [namespace] [pod] - Show pod logs"
    echo "  restart [namespace] [app] - Restart deployment"
    echo "  deploy [namespace]     - Deploy to namespace"
    echo "  cleanup [namespace]    - Delete all pods in namespace"
    echo ""
    echo "Examples:"
    echo "  $0 status production"
    echo "  $0 scale production goal-tracker-frontend 6"
    echo "  $0 logs staging goal-tracker-backend-abc123"
    echo "  $0 deploy staging"
    echo "  $0 cleanup development"
}

# Function to show pod status
show_status() {
    local namespace=${1:-"all"}
    echo -e "${GREEN}=== Pod Status ===${NC}"
    if [ "$namespace" = "all" ]; then
        kubectl get pods --all-namespaces
    else
        kubectl get pods -n $namespace
    fi
}

# Function to scale pods
scale_pods() {
    local namespace=$1
    local app=$2
    local replicas=$3
    
    if [ -z "$namespace" ] || [ -z "$app" ] || [ -z "$replicas" ]; then
        echo -e "${RED}Error: Missing arguments${NC}"
        echo "Usage: $0 scale [namespace] [app] [replicas]"
        return 1
    fi
    
    echo -e "${YELLOW}Scaling $app to $replicas replicas in $namespace...${NC}"
    kubectl scale deployment $app --replicas=$replicas -n $namespace
    echo -e "${GREEN}✅ Scaling complete!${NC}"
}

# Function to show logs
show_logs() {
    local namespace=$1
    local pod=$2
    
    if [ -z "$namespace" ] || [ -z "$pod" ]; then
        echo -e "${RED}Error: Missing arguments${NC}"
        echo "Usage: $0 logs [namespace] [pod]"
        return 1
    fi
    
    echo -e "${GREEN}=== Logs for $pod in $namespace ===${NC}"
    kubectl logs $pod -n $namespace
}

# Function to restart deployment
restart_deployment() {
    local namespace=$1
    local app=$2
    
    if [ -z "$namespace" ] || [ -z "$app" ]; then
        echo -e "${RED}Error: Missing arguments${NC}"
        echo "Usage: $0 restart [namespace] [app]"
        return 1
    fi
    
    echo -e "${YELLOW}Restarting $app in $namespace...${NC}"
    kubectl rollout restart deployment $app -n $namespace
    echo -e "${GREEN}✅ Restart initiated!${NC}"
}

# Function to deploy
deploy() {
    local namespace=$1
    
    if [ -z "$namespace" ]; then
        echo -e "${RED}Error: Missing namespace${NC}"
        echo "Usage: $0 deploy [namespace]"
        return 1
    fi
    
    echo -e "${YELLOW}Deploying to $namespace...${NC}"
    kubectl apply -f k8s/namespaces.yaml
    kubectl apply -f k8s/backend-deployment.yaml -n $namespace
    kubectl apply -f k8s/frontend-deployment.yaml -n $namespace
    echo -e "${GREEN}✅ Deployment complete!${NC}"
}

# Function to cleanup
cleanup() {
    local namespace=$1
    
    if [ -z "$namespace" ]; then
        echo -e "${RED}Error: Missing namespace${NC}"
        echo "Usage: $0 cleanup [namespace]"
        return 1
    fi
    
    echo -e "${RED}⚠️  This will delete ALL pods in $namespace!${NC}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kubectl delete pods --all -n $namespace
        echo -e "${GREEN}✅ Cleanup complete!${NC}"
    else
        echo "Cancelled."
    fi
}

# Main script logic
case "$1" in
    "status")
        show_status $2
        ;;
    "scale")
        scale_pods $2 $3 $4
        ;;
    "logs")
        show_logs $2 $3
        ;;
    "restart")
        restart_deployment $2 $3
        ;;
    "deploy")
        deploy $2
        ;;
    "cleanup")
        cleanup $2
        ;;
    *)
        show_help
        ;;
esac
