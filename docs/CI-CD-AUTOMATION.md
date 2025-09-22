# CI/CD Automation Guide

## 🚀 Automated Deployment Features

Your GitHub Actions workflow now automatically handles:

### **1. Branch-Based Deployments**
- `main` branch → **Production** (4 replicas)
- `develop` branch → **Staging** (2 replicas)  
- `feature/*` branches → **Staging** (2 replicas)
- Other branches → **Development** (1 replica)

### **2. Manual Deployments**
- Go to **Actions** tab in GitHub
- Click **"Goal Tracker CI/CD"**
- Click **"Run workflow"**
- Choose environment and replica count

### **3. Automatic Pod Management**
- ✅ Creates namespaces automatically
- ✅ Scales pods based on environment
- ✅ Updates images with commit SHA
- ✅ Waits for rollout completion
- ✅ Health checks all deployments
- ✅ Cleans up old development deployments

## 📋 Required GitHub Secrets

Add these secrets in your GitHub repository settings:

```bash
# Google Cloud credentials
GCP_PROJECT_ID=your-project-id
GCP_SA_KEY={"type": "service_account", ...}

# GKE cluster details
GKE_CLUSTER_NAME=your-cluster-name
GKE_ZONE=your-zone
```

## 🔄 Deployment Workflow

### **Automatic (on push/merge):**
```bash
# Feature development
git checkout -b feature/new-dashboard
git push origin feature/new-dashboard
# → Deploys to STAGING (2 replicas)

# Production release
git checkout main
git merge feature/new-dashboard
git push origin main
# → Deploys to PRODUCTION (4 replicas)
```

### **Manual (via GitHub UI):**
1. Go to **Actions** → **Goal Tracker CI/CD**
2. Click **"Run workflow"**
3. Select environment: `staging` or `production`
4. Set replicas: `1-10`
5. Click **"Run workflow"**

## 📊 Monitoring Deployments

### **Check Deployment Status:**
```bash
# All environments
kubectl get pods --all-namespaces

# Specific environment
kubectl get pods -n production
kubectl get pods -n staging
kubectl get pods -n development
```

### **Get Application URLs:**
```bash
# Production URL
kubectl get services -n production

# Staging URL  
kubectl get services -n staging

# Quick URL extraction
kubectl get service goal-tracker-frontend-service -n production -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

### **View Logs:**
```bash
# All pods in environment
kubectl logs -l app=goal-tracker-frontend -n production

# Specific pod
kubectl logs goal-tracker-frontend-abc123 -n production
```

## 🛠️ Manual Pod Management

### **Using the Management Script:**
```bash
# Show all pods
./scripts/manage-pods.sh status

# Scale pods
./scripts/manage-pods.sh scale production goal-tracker-frontend 6

# Deploy to specific environment
./scripts/manage-pods.sh deploy staging

# View logs
./scripts/manage-pods.sh logs production goal-tracker-backend-abc123

# Restart deployment
./scripts/manage-pods.sh restart production goal-tracker-frontend
```

### **Direct kubectl Commands:**
```bash
# Scale deployments
kubectl scale deployment goal-tracker-frontend --replicas=4 -n production

# Update images
kubectl set image deployment/goal-tracker-frontend frontend=gcr.io/PROJECT/goal-tracker-frontend:v2.0.0 -n production

# Rollback deployment
kubectl rollout undo deployment/goal-tracker-frontend -n production

# Delete deployment
kubectl delete deployment goal-tracker-frontend -n staging
```

## 🔍 Troubleshooting

### **Check Workflow Logs:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Check the **"Deploy to [environment]"** step

### **Common Issues:**

**1. Pods not starting:**
```bash
kubectl describe pod POD_NAME -n NAMESPACE
kubectl logs POD_NAME -n NAMESPACE
```

**2. Service not accessible:**
```bash
kubectl get services -n NAMESPACE
kubectl describe service SERVICE_NAME -n NAMESPACE
```

**3. Image pull errors:**
```bash
kubectl describe pod POD_NAME -n NAMESPACE | grep -A 5 "Events:"
```

## 📈 Resource Management

### **Check Resource Usage:**
```bash
# Node resources
kubectl top nodes

# Pod resources
kubectl top pods -n production

# Resource quotas
kubectl describe resourcequota -n production
```

### **Set Resource Limits:**
```bash
# Update deployment with resource limits
kubectl patch deployment goal-tracker-frontend -n production -p '{"spec":{"template":{"spec":{"containers":[{"name":"frontend","resources":{"limits":{"cpu":"500m","memory":"512Mi"}}}]}}}}'
```

## 🎯 Best Practices

1. **Always test in staging first**
2. **Use feature branches for development**
3. **Monitor resource usage regularly**
4. **Keep only necessary replicas in development**
5. **Use the management script for quick operations**
6. **Check logs when deployments fail**

## 🚨 Emergency Procedures

### **Quick Rollback:**
```bash
kubectl rollout undo deployment/goal-tracker-frontend -n production
kubectl rollout undo deployment/goal-tracker-backend -n production
```

### **Stop All Pods:**
```bash
kubectl scale deployment goal-tracker-frontend --replicas=0 -n production
kubectl scale deployment goal-tracker-backend --replicas=0 -n production
```

### **Delete Everything:**
```bash
kubectl delete namespace production
kubectl delete namespace staging
kubectl delete namespace development
```
