## GCSecrets - a Drone.io plugin to admin GCP Secrets


### Overview

The plugin takes the secrets you need to store on GCP and then deletes them 
if they are present on GCP and re-creates them with a new version with value
If there is a Secret present at GCP that is not in the list it gets deleted
so be carefull!
In future versions, the plugin will manage Secret versions.

#### Deploying Secrets

Example `.drone.yml` file:

```yaml
kind: pipeline
type: docker
name: default

steps:
- name: gcsecrets
  image: ateszki/gcsecrets
  pull: if-not-exists
  environment:
    google_credentials: 
      from_secret: gcp_secrets_credentials_stg  
    project_id: <GCP Project id> 
  settings:
    secrets:
      string_var: "aaa67890zzz"
      numeric_var: 322232
      list_var: [1,2,4,5]
```