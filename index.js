const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

const projectId = process.env.project_id;
const randomFileName = `${uuidv4()}.json`;
const keyFilename = `/tmp/${randomFileName}`;

fs.writeFileSync(keyFilename, process.env.google_credentials);

const client = new SecretManagerServiceClient({projectId, keyFilename});

const app = async() => {
    console.log('GCP Secrets config started');

    const createSecret = async (parent, secret_name) => {
        try {
            const [secret] = await client.createSecret({
              parent: parent,
              secretId: secret_name,
              secret: {
                replication: {
                  automatic: {},
                },
              },
            });
            console.log(`Created secret ${secret.name}`);
            return true;
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }
    }
    
    const addSecretVersion = async (parent, value) => {
        try { 
            const payload = Buffer.from(value, 'utf8');
            const [version] = await client.addSecretVersion({
                parent: parent,
                payload: {
                data: payload,
                },
            });
        
            console.log(`Added secret version ${version.name}`);
            return true;
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }
    }
    
    const deleteSecret = async (name) => {
        try {
            await client.deleteSecret({
              name: name,
            });
        
            console.log(`Deleted secret ${name}`);
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }
    }

    try {    
        

        const parent = `projects/${projectId}`;
    
        const [secrets] = await client.listSecrets({
            parent: parent,
        });
    
        const secrets_names = secrets.map(secret => {
            return secret.name.split('/').pop();
        });

        
        const plugin_secrets = JSON.parse(process.env.PLUGIN_SECRETS);
        const plugin_secrets_names = Object.keys(plugin_secrets);

        plugin_secrets_names.forEach(async name => {
            //if the settings secret already exists is deleted
            if(secrets_names.includes(name) === true){
                await deleteSecret(`${parent}/secrets/${name}`);
            }
            //creates the secret
            await createSecret(parent, name);
            // a new version of the secret is added
            const value = plugin_secrets[name];
            await addSecretVersion(`${parent}/secrets/${name}`, value.toString());

        });

        secrets_names.forEach(async name => {
            //if the secret exists in GCP but not in the settings it is deleted
            if(plugin_secrets_names.includes(name) === false){
                await deleteSecret(`${parent}/secrets/${name}`);
            }
        });

        
    
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
app();