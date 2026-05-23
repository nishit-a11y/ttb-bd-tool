# Deployment Instructions

To deploy the application, you can use the `deploy.sh` script located in the EC2 instance. The following commands can be run using the script:

-   If you use the `-b` flag, the backend will be deployed by running the following commands:

**Commands**

    git pull
    npm install
    pm2 restart backend

-   If you use the `-f` flag, the frontend will be deployed by running the following commands:

**Commands**

    git pull
    npm install
    npm run build

**Note:** if you push the code to a different branch other than `Jeeva` or `Merger`, you should checkout to the respective branch before running the deployment commands.

To deploy the backend, run the following command in your terminal:

**Backend**

`ssh -i "int-ftp-user.pem" ftp-user@65.0.248.54 './deploy.sh -b'`

To deploy the frontend, run the following command in your terminal:

**Frontend**

`ssh -i "int-ftp-user.pem" ftp-user@65.0.248.54 './deploy.sh -f'`
