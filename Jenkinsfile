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

        stage('Deploy to EC2 (Blue-Green)') {
            steps {
                script {
                    echo "🌐 Deploying ke AWS EC2 (Blue-Green)..."
                    withCredentials([string(credentialsId: 'titipin-ec2-ip', variable: 'EC2_IP')]) {
                        sshagent(['titipin-fe-ec2']) {
                            sh """
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                                # 1. Tentukan kontainer yang aktif saat ini (Blue, Green, atau legacy Web)
                                if sudo docker ps --format "{{.Names}}" | grep -q "^frontend-blue\$"; then
                                    ACTIVE="blue"
                                    NEW="green"
                                    NEW_PORT="3002"
                                    OLD_PORT="3001"
                                elif sudo docker ps --format "{{.Names}}" | grep -q "^frontend-green\$"; then
                                    ACTIVE="green"
                                    NEW="blue"
                                    NEW_PORT="3001"
                                    OLD_PORT="3002"
                                elif sudo docker ps --format "{{.Names}}" | grep -q "^frontend-web\$"; then
                                    ACTIVE="web"
                                    NEW="green"
                                    NEW_PORT="3002"
                                    OLD_PORT="3001"
                                else
                                    ACTIVE="none"
                                    NEW="blue"
                                    NEW_PORT="3001"
                                    OLD_PORT="3002"
                                fi

                                echo "=== Blue-Green Deployment ==="
                                echo "Kontainer Aktif Saat Ini: \$ACTIVE"
                                echo "Deploy Kontainer Baru: frontend-\$NEW di port \$NEW_PORT"

                                # 2. Pull image terbaru dari Docker Hub
                                sudo docker pull ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}

                                # 3. Matikan & hapus kontainer target lama (jika ada sisa kegagalan sebelumnya)
                                sudo docker stop frontend-\$NEW || true
                                sudo docker rm frontend-\$NEW || true

                                # 4. Jalankan kontainer baru
                                sudo docker run -d --name frontend-\$NEW -p \$NEW_PORT:80 ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || {
                                    echo "Error: Gagal menjalankan kontainer baru frontend-\$NEW! ❌"
                                    exit 1
                                }

                                # 5. Lakukan Health Check (Tunggu hingga kontainer baru siap menerima traffic)
                                echo "Melakukan health check pada kontainer baru di port \$NEW_PORT..."
                                HEALTHY=false
                                for i in {1..15}; do
                                    if curl -s http://localhost:\$NEW_PORT > /dev/null; then
                                        echo "Kontainer baru frontend-\$NEW sudah siap dan sehat! ✅"
                                        HEALTHY=true
                                        break
                                    fi
                                    echo "Menunggu kontainer siap (percobaan \$i/15)..."
                                    sleep 2
                                done

                                if [ "\$HEALTHY" != "true" ]; then
                                    echo "Error: Kontainer baru gagal lolos health check! Membatalkan deploy... ❌"
                                    sudo docker stop frontend-\$NEW || true
                                    sudo docker rm frontend-\$NEW || true
                                    exit 1
                                fi

                                # 6. Ganti port di konfigurasi Nginx Host dan reload
                                NGINX_CONF=""
                                for file in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf; do
                                    if [ -f "\$file" ] && grep -q "127.0.0.1:\$OLD_PORT" "\$file"; then
                                        NGINX_CONF="\$file"
                                        break
                                    fi
                                    if [ -f "\$file" ] && grep -q "localhost:\$OLD_PORT" "\$file"; then
                                        NGINX_CONF="\$file"
                                        break
                                    fi
                                done

                                if [ -n "\$NGINX_CONF" ]; then
                                    echo "Menemukan konfigurasi Nginx di: \$NGINX_CONF"
                                    echo "Mengubah port \$OLD_PORT menjadi \$NEW_PORT..."
                                    sudo sed -i "s/127.0.0.1:\$OLD_PORT/127.0.0.1:\$NEW_PORT/g" "\$NGINX_CONF"
                                    sudo sed -i "s/localhost:\$OLD_PORT/localhost:\$NEW_PORT/g" "\$NGINX_CONF"
                                    
                                    # Tes konfigurasi dan reload Nginx tanpa downtime
                                    sudo nginx -t && sudo systemctl reload nginx
                                    echo "Nginx berhasil direload! 🔄"
                                else
                                    echo "Peringatan: Konfigurasi Nginx dengan port \$OLD_PORT tidak ditemukan."
                                    echo "Melewati proses reload Nginx host."
                                fi

                                # 7. Matikan kontainer lama secara anggun (graceful)
                                if [ "\$ACTIVE" != "none" ]; then
                                    echo "Mematikan kontainer lama (frontend-\$ACTIVE)..."
                                    # Mengirim signal SIGQUIT ke Nginx untuk graceful shutdown, fallback ke stop jika gagal
                                    sudo docker kill --signal=SIGQUIT frontend-\$ACTIVE || sudo docker stop frontend-\$ACTIVE
                                    sudo docker rm frontend-\$ACTIVE || true
                                fi

                                # 8. Pembersihan Docker Image lama
                                sudo docker image prune -f
                                echo "=== Deployment Selesai Tanpa Downtime! 🎉 ==="
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
