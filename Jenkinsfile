node {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Build image') {
        app = docker.build('atabbakh/example-app')
    }

    stage('Test') {
        app.inside {
          sh 'npm test'
        }
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
          app.push('latest')
        }
    }

    stage('Deploiement Ansible') {
        ansiblePlaybook(
            playbook: 'ansible-playbooks.yaml',
            credentialsId: 'azure-credentials'
        )
    }
}
