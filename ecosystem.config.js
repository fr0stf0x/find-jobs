var postDeployCommand = "yarn && pm2 startOrRestart ecosystem.config.js --env production";

module.exports = {
    apps: [
        {
            name: "worker",
            script: "./worker/index.js",
            watch: true,
            env: {
                "NODE_ENV": "development",
            },
            env_production: {
                "NODE_ENV": "production"
            }
        }, {
            name: "api-app",
            script: "./api/index.js",
            instances: 2,
            exec_mode: "cluster"
        // }, {
        //     name: "react-app",
        //     script: "serve -s client/build",
        //     exec_mode: "fork"
        }
    ],
    "deploy": {
        "production": {
            "user": "root",
            "host": ["206.189.148.225"],
            "ref": "origin/master",
            "repo": "https://github.com/fr0stf0x/find-jobs.git",
            "path": "/var/www/html/find-jobs",
            "post-deploy": postDeployCommand,
            "env": {
                "NODE_ENV": "production"
            }
        },
    }
}
