pipeline {
  agent any
  environment {
    REGISTRY = 'ghcr.io'
    ORG = 'youruser'
    BACKEND_IMAGE = "${REGISTRY}/${ORG}/ats-backend:latest"
    FRONTEND_IMAGE = "${REGISTRY}/${ORG}/ats-frontend:latest"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Backend Build') {
      steps {
        dir('backend') {
          sh 'docker build -t $BACKEND_IMAGE .'
        }
      }
    }
    stage('Frontend Build') {
      steps {
        dir('frontend') {
          sh 'docker build -t $FRONTEND_IMAGE .'
        }
      }
    }
    stage('Login & Push') {
      steps {
        withCredentials([string(credentialsId: 'ghcr-pat', variable: 'CR_PAT')]) {
          sh 'echo $CR_PAT | docker login ghcr.io -u youruser --password-stdin'
          sh 'docker push $BACKEND_IMAGE'
          sh 'docker push $FRONTEND_IMAGE'
        }
      }
    }
    stage('Kubernetes Deploy') {
      when { expression { return fileExists('k8s') } }
      steps {
        sh 'kubectl apply -f k8s/backend-deployment.yaml'
        sh 'kubectl apply -f k8s/frontend-deployment.yaml'
        sh 'kubectl apply -f k8s/ingress.yaml'
      }
    }
  }
}


