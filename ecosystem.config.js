var postDeployCommand = "yarn && cd /var/www/find-jobs/source/client && yarn && yarn run build && pm2 startOrRestart ecosystem.config.js --env production";

module.exports = {
    apps: [{
        name: "worker",
        script: "./worker/tasks/index.js",
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
        instances: 4,
        exec_mode: "cluster"
    }, {
        name: "react-app",
        script: "serve -- -s build",
        exec_mode: "fork"
    }],
    "deploy": {
        "production": {
            "user": "root",
            "host": ["206.189.148.225"],
            "ref": "origin/master",
            "repo": "https://github.com/fr0stf0x/find-jobs.git",
            "path": "/var/www/find-jobs",
            "post-deploy": postDeployCommand,
            "env": {
                "NODE_ENV": "production"
            }
        },
    }
}
