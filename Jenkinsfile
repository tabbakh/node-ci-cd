node {
    def app
    def shortCommitHash = getShortCommitHash()

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
          app.push(shortCommitHash)
        }
    }

    stage('Deploiement Ansible') {
        ansiblePlaybook(
            playbook: 'playbooks/azure.yaml',
            inventory: 'inventories/azure.txt',
            credentialsId: 'azure-credentials'
        )
    }
}
