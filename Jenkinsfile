def getShortCommitHash() {
    return sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
}

node {
    def app
    def shortCommitHash

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

    if ("${env.BRANCH_NAME}" == "master") {
        shortCommitHash = getShortCommitHash()
        stage('Push image') {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
              app.push(shortCommitHash)
            }
        }

        stage('Deploiement Ansible') {
            ansiblePlaybook(
                playbook: 'playbooks/azure.yaml',
                inventory: 'inventories/azure.txt',
                credentialsId: 'azure-credentials',
                extras: '--extra-vars "short_commit_hash=' + shortCommitHash +'"'
            )
        }
    }
}
