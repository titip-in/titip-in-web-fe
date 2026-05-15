pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKER_HUB_USER = 'oktaavsm' 
        IMAGE_NAME = 'titipin-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        EC2_USER = 'ubuntu'
    }

    stages {
        stage('Install & Test') {
            steps {
                script {
                    echo "📦 Installing dependencies..."
                    sh "npm ci"
                    echo "🔍 Linting & Type Checking..."
                    // sh "npm run lint"
                    sh "npm run type-check"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🛠️ Membangun Docker Image..."
                    sh """
                    docker build \
                        --build-arg VITE_API_URL=${VITE_API_URL} \
                        -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} \
                        -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "🚀 Push Image ke Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'jenkins-cicd', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    echo "🌐 Deploying ke AWS EC2..."
                    withCredentials([string(credentialsId: 'titipin-ec2-ip', variable: 'EC2_IP')]) {
                        sshagent(['titipin-fe-ec2']) {
                            sh """
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                                docker pull ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                                
                                docker stop frontend-web || true
                                docker rm frontend-web || true
                                
                                docker run -d --name frontend-web -p 3001:80 ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                                
                                docker image prune -f
                            '
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo "🏁 CI/CD Process Finished."
        }
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed. Please check the logs."
        }
    }
}
