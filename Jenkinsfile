pipeline {
    agent any

    options {
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                echo 'Setting up environment...'
                bat 'npm install'
                bat 'npx playwright install'
            }
        }

        stage('Lint') {
            steps {
                echo 'Running lint...'
                bat 'npm run lint'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo 'Running tests...'
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            echo 'Archiving test reports...'
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            
            // Requires "HTML Publisher" plugin
            // publishHTML(target: [
            //     allowMissing: false,
            //     alwaysLinkToLastBuild: true,
            //     keepAll: true,
            //     reportDir: 'playwright-report',
            //     reportFiles: 'index.html',
            //     reportName: 'Playwright HTML Report'
            // ])
        }
        failure {
            echo 'Pipeline failed. Please check the logs and artifacts.'
        }
    }
}
