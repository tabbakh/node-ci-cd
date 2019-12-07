def getShortCommitHash() {
    return sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
}

node {
    def app
    def shortCommitHash

    stage('Clone repository') {
        checkout scm
        shortCommitHash = getShortCommitHash()
    }

    stage('Build image') {
        app = docker.build('atabbakh/example-app')
    }

    stage('Test') {
        app.inside {
          sh 'npm test'
        }
    }

    if ("${env.BRANCH_NAME}" == "master" || "${env.BRANCH_NAME}" == "develop") {
        stage('Push image') {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
              app.push(shortCommitHash)
            }
        }

        if ("${env.BRANCH_NAME}" == "develop") {
            stage('Deploiement Ansible staging') {
                ansiblePlaybook(
                    playbook: 'playbooks/azure.yaml',
                    inventory: 'inventories/azure.txt',
                    credentialsId: 'azure-vm2',
                    extras: '--extra-vars "short_commit_hash=' + shortCommitHash +' host=staging"'
                )
            }
        }

        if ("${env.BRANCH_NAME}" == "master") {
            stage('Deploiement Ansible prod') {
                ansiblePlaybook(
                    playbook: 'playbooks/azure.yaml',
                    inventory: 'inventories/azure.txt',
                    credentialsId: 'azure-credentials',
                    extras: '--extra-vars "short_commit_hash=' + shortCommitHash +' host=prod"'
                )
            }
        }
    }
}
