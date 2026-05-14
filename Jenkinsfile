pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'oktaavsm' 
        IMAGE_NAME = 'titipin-frontend'
        IMAGE_TAG = 'latest'
        EC2_IP = 'IP_PUBLIC_EC2_KAMU'
        EC2_USER = 'ubuntu'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🛠️ Membangun Docker Image..."
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
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
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    echo "🌐 Deploying ke AWS EC2..."
                    sshagent(['titipin-fe-ec2']) {
                        sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                            docker pull ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                            
                            docker stop frontend-web || true
                            docker rm frontend-web || true
                            
                            docker run -d --name frontend-web -p 80:80 ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                            
                            docker image prune -a -f
                        '
                        """
                    }
                }
            }
        }
    }
}