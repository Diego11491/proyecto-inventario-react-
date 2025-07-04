pipeline {
  agent {
    docker {
      image 'node:18' // Imagen oficial de Node.js con npm
    }
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        echo 'Repositorio clonado automáticamente por Jenkins desde Git'
      }
    }

    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
      }
    }

    stage('Ejecutar tests') {
      steps {
        // Solo si tienes tests. Puedes comentar esta línea si no
        sh 'npm run test'
      }
    }

    stage('Build de la app') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Post-Build') {
      steps {
        echo '✅ Build finalizado correctamente. Archivos listos en /dist'
        // Aquí podrías subir los archivos a un servidor si quieres
      }
    }
  }
}
