<!-- start title -->

# GitHub Action:Kind Test

<!-- end title -->
<!-- start description -->

Creates a kind cluster, installs helm charts, runs an app via skaffold, and runs tests

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: swarm-io/action-kind-test@undefined
  with:
    # Github token, if there are dependencies, this should be a PAT so that the other
    # repos can be cloned
    # Default: ${{ github.token }}
    token: ""

    # Git ref to use
    # Default: ${{ github.ref }}
    ref: ""

    # What test command to run
    # Default: go test
    test-command: ""

    # Directory to run tests from
    # Default: test
    test-working-directory: ""

    # Ports to wait for, used for dependent charts, if those charts need exposed local
    # ports as part of testing. Comma separated list such as `8000,8001`
    # Default:
    wait-for-ports: ""

    # Max time in milliseconds to wait for readiness on ports set in `wait-for-ports`
    # Default: 300000
    max-wait: ""

    # Interval to check readiness on ports set in `wait-for-ports`
    # Default: 5000
    check-interval: ""

    # Helm charts to install, a json formatted string, that is a list of objects
    # Default: []
    helm-charts: ""

    # Gcloud service account credentials json. This is required if you are installing
    # helm charts
    credentials-json: ""

    # gcloud project id. This is required if you are installing helm charts
    project-id: ""

    # artifact registry region
    # Default: us-west1
    region: ""

    # artifact registry repository
    # Default: charts
    repository: ""

    # How long to wait for installed charts to be healthy before failing
    # Default: 3m
    helm-install-wait-timeout: ""

    # Other git repos in this organization to clone and run skaffold for. Should be a
    # comma separated list of short repository names, excluding the organization
    # Default:
    dependencies: ""

    # Seconds to sleep before running tests
    # Default: 10
    sleep: ""

    # set to true to add a private helm repo
    # Default: false
    add-private-helm-repo: ""

    # Helm repository name to add
    # Default: swarm
    helm-repo-name: ""

    # Helm repository url
    # Default: https://raw.githubusercontent.com/${{ github.repository_owner }}/charts/main
    helm-repo-url: ""

    # Helm repository username
    # Default:
    helm-repo-username: ""

    # Helm repository password
    # Default:
    helm-repo-password: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                       | **Description**                                                                                                                                            |                                  **Default**                                   | **Required** |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------: | :----------: |
| **`token`**                     | Github token, if there are dependencies, this should be a PAT so that the other repos can be cloned                                                        |                             `${{ github.token }}`                              |  **false**   |
| **`ref`**                       | Git ref to use                                                                                                                                             |                              `${{ github.ref }}`                               |  **false**   |
| **`test-command`**              | What test command to run                                                                                                                                   |                                   `go test`                                    |  **false**   |
| **`test-working-directory`**    | Directory to run tests from                                                                                                                                |                                     `test`                                     |  **false**   |
| **`wait-for-ports`**            | Ports to wait for, used for dependent charts, if those charts need exposed local ports as part of testing. Comma separated list such as `8000,8001`        |                                                                                |  **false**   |
| **`max-wait`**                  | Max time in milliseconds to wait for readiness on ports set in `wait-for-ports`                                                                            |                                    `300000`                                    |  **false**   |
| **`check-interval`**            | Interval to check readiness on ports set in `wait-for-ports`                                                                                               |                                     `5000`                                     |  **false**   |
| **`helm-charts`**               | Helm charts to install, a json formatted string, that is a list of objects                                                                                 |                                      `[]`                                      |  **false**   |
| **`credentials-json`**          | Gcloud service account credentials json. This is required if you are installing helm charts                                                                |                                                                                |  **false**   |
| **`project-id`**                | gcloud project id. This is required if you are installing helm charts                                                                                      |                                                                                |  **false**   |
| **`region`**                    | artifact registry region                                                                                                                                   |                                   `us-west1`                                   |  **false**   |
| **`repository`**                | artifact registry repository                                                                                                                               |                                    `charts`                                    |  **false**   |
| **`helm-install-wait-timeout`** | How long to wait for installed charts to be healthy before failing                                                                                         |                                      `3m`                                      |  **false**   |
| **`dependencies`**              | Other git repos in this organization to clone and run skaffold for. Should be a comma separated list of short repository names, excluding the organization |                                                                                |  **false**   |
| **`sleep`**                     | Seconds to sleep before running tests                                                                                                                      |                                      `10`                                      |  **false**   |
| **`add-private-helm-repo`**     | set to true to add a private helm repo                                                                                                                     |                                                                                |  **false**   |
| **`helm-repo-name`**            | Helm repository name to add                                                                                                                                |                                    `swarm`                                     |  **false**   |
| **`helm-repo-url`**             | Helm repository url                                                                                                                                        | `https://raw.githubusercontent.com/${{ github.repository_owner }}/charts/main` |  **false**   |
| **`helm-repo-username`**        | Helm repository username                                                                                                                                   |                                                                                |  **false**   |
| **`helm-repo-password`**        | Helm repository password                                                                                                                                   |                                                                                |  **false**   |

<!-- end inputs -->
<!-- start outputs -->
<!-- end outputs -->
<!-- start examples -->

### Example usage

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to say hello
    steps:
      - uses: actions/checkout@v2
      - id: foo
        uses: actions/hello-world-composite-action@v1
        with:
          who-to-greet: "Mona the Octocat"
      - run: echo random-number ${{ steps.foo.outputs.random-number }}
        shell: bash
```

<!-- end examples -->
<!-- start [.github/ghdocs/examples/] -->
<!-- end [.github/ghdocs/examples/] -->
