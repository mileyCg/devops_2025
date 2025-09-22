# GitHub Secrets Setup Guide

## 🔐 Required GitHub Secrets

To fix the authentication error, you need to set up these secrets in your GitHub repository:

### **1. Go to Repository Settings**
1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### **2. Add These Secrets:**

#### **GCP_PROJECT_ID**
- **Name:** `GCP_PROJECT_ID`
- **Value:** Your Google Cloud Project ID (e.g., `my-project-123456`)

#### **GCP_SA_KEY**
- **Name:** `GCP_SA_KEY`
- **Value:** Complete service account JSON key

#### **GKE_CLUSTER_NAME**
- **Name:** `GKE_CLUSTER_NAME`
- **Value:** Your GKE cluster name (e.g., `goal-tracker-cluster`)

#### **GKE_ZONE**
- **Name:** `GKE_ZONE`
- **Value:** Your GKE cluster zone (e.g., `us-central1-a`)

## 🔑 How to Get GCP_SA_KEY

### **Option 1: Create New Service Account**
```bash
# 1. Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --description="Service account for GitHub Actions"

# 2. Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# 3. Create and download key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com

# 4. Copy the content of github-actions-key.json
cat github-actions-key.json
```

### **Option 2: Use Existing Service Account**
```bash
# List existing service accounts
gcloud iam service-accounts list

# Create key for existing service account
gcloud iam service-accounts keys create existing-sa-key.json \
    --iam-account=EXISTING_SA@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Copy the content
cat existing-sa-key.json
```

## 📋 Service Account Permissions Required

Your service account needs these roles:
- `roles/container.developer` - Deploy to GKE
- `roles/storage.admin` - Push to Container Registry
- `roles/iam.serviceAccountUser` - Use service account

## 🔍 Troubleshooting

### **Error: "credentials_json" not found**
- ✅ Check if `GCP_SA_KEY` secret exists
- ✅ Verify the JSON is complete and valid
- ✅ Make sure there are no extra spaces or characters

### **Error: "project_id" not found**
- ✅ Check if `GCP_PROJECT_ID` secret exists
- ✅ Verify the project ID is correct

### **Error: "workload_identity_provider" not found**
- ✅ This is expected - we're using `credentials_json` method
- ✅ The error should disappear once secrets are properly set

## 🧪 Test Your Setup

### **1. Check Secrets Are Set:**
```bash
# In your workflow, add this step to debug:
- name: Debug secrets
  run: |
    echo "GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}"
    echo "GCP_SA_KEY length: ${#GCP_SA_KEY}"
    echo "GKE_CLUSTER_NAME: ${{ secrets.GKE_CLUSTER_NAME }}"
    echo "GKE_ZONE: ${{ secrets.GKE_ZONE }}"
```

### **2. Test Authentication Locally:**
```bash
# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"

# Test authentication
gcloud auth list
gcloud config get-value project
```

## 🚀 Alternative: Workload Identity (Advanced)

If you prefer not to use service account keys, you can use Workload Identity:

### **1. Enable Workload Identity:**
```bash
# Enable Workload Identity on your cluster
gcloud container clusters update YOUR_CLUSTER_NAME \
    --workload-pool=YOUR_PROJECT_ID.svc.id.goog \
    --zone=YOUR_ZONE
```

### **2. Update Workflow:**
```yaml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID
    service_account: SERVICE_ACCOUNT_EMAIL
```

## ✅ Verification Checklist

- [ ] `GCP_PROJECT_ID` secret is set
- [ ] `GCP_SA_KEY` secret is set with complete JSON
- [ ] `GKE_CLUSTER_NAME` secret is set
- [ ] `GKE_ZONE` secret is set
- [ ] Service account has required permissions
- [ ] GKE cluster exists and is accessible
- [ ] Container Registry is enabled

## 🆘 Still Having Issues?

1. **Check the workflow logs** in GitHub Actions
2. **Verify all secrets are set** in repository settings
3. **Test authentication locally** with the same service account
4. **Check GKE cluster status** in Google Cloud Console
5. **Ensure Container Registry is enabled** in your project

Once all secrets are properly configured, your workflow should run successfully! 🎉
