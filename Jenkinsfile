pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'yarn'
      }
    }
    // stage('Test') {
    //   steps {
    //     sh 'yarn test'
    //   }
    // }
    stage('Deploy') {
      steps {
        sh 'yarn build'
      }
    }
  }
}