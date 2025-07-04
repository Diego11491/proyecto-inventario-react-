pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // Configurar en Jenkins Global Tool Configuration
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Diego11491/proyecto-inventario-react-.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test -- --coverage --watchAll=false'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}