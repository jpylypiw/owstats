# owstats

### Description

Private Overwatch statistics backend application.

### References

1. [OWAPI - Overwatch JSON API](https://github.com/SunDwarf/OWAPI)
2. [Node.js](https://nodejs.org/en/)
3. [mysqljs - A pure node.js JavaScript Client implementing the MySql protocol.](https://github.com/mysqljs/mysql)

### Installation

We recommend a linux / unix environment for use of owapi and owstats.

Linux Installation steps (Optimized for Debian):

1. Follow the installation steps of OWAPI showed in their [README.md](https://github.com/SunDwarf/OWAPI/blob/master/README.md)
2. To use owapi as systemd service add the following content into the file `/lib/systemd/system/owapi.service` and edit the file for your environment.
```
[Unit]
Description=OWAPI - Overwatch API
Wants=network-online.target
After=syslog.target time-sync.target network.target network-online.target

[Service]
Type=oneshot
ExecStart=/opt/OWAPI/run.sh
User=owapi
Group=owapi

[Install]
WantedBy=multi-user.target
Alias=owapi.service


```
3. add the following content into `/PATH TO OWAPI/run.sh` and edit the file for your system.

```
#!/usr/bin/env bash

export LC_ALL=C.UTF-8
export LANG=C.UTF-8

cd /opt/OWAPI

python3.5 -m venv ./venv

source ./venv/bin/activate

PYTHONPATH=. asphalt run -l uvloop config.yml

exit 0
```
4. start the owapi service and look out for errors. You have to cancel the script after starting using `Strg + C`
5. Clone this repository into a folder you like. We recommend `/opt/owstats` or `/usr/local/owstats`
6. execute the `setup.sql` file in your MySQL or MariaDB database.
7. Edit the `readdata.js` file with your database settings-
8. Execute `node readdata.js` and watch for possible errors.
9. Add the following line to your crontab with the command `crontab -e` and edit the execute frequency.

```
*/30 * * * * /usr/bin/node /opt/owstats/readdata.js
``` 