### Setup STUN/TURN server using Coturn
1. firewall, cloud security groups の以下のポートを開けておく
3478 TCP & UDP
49152–65535 UDP
2. install coturn from ubuntu package repository
sudo apt-get update
sudo apt-get install coturn
3. Start the Coturn Daemon at Startup
To let it auto-start at system boot time, modify /etc/default/coturn file.
`sudo nano /etc/default/coturn`
Find the following line and uncomment it by removing the # to run Coturn as an automatic system service daemon.
`#TURNSERVER_ENABLED=1`
Save and close the file and then
`systemctl start coturn`
4. Create a TURN user to Next, edit the main configuration file.
Then open or create /etc/turnserver.conf file and paste the following content.
```
fingerprint
user={USERNAME}:{PASSWORD} //user=kavirajan:123456
lt-cred-mech
realm=kurento.org
log-file=/var/log/turnserver/turnserver.log
simple-log
external-ip={PUBLIC_IP_ADDRESS} //external-ip=98.112.65.70
```
5. Restart the Coturn Service
restart the service
sudo service coturn restart

6. Testing Time
Go to the Trickle ICE(Interactive Conectivity Establishment) page and enter your own TURN server details.
```
STUN or TURN URI: turn:{PUBLIC_IP_ADDRESS}:3478
TURN username: {USERNAME}
TURN password: {PASSWORD}
```
Then click Add Server and then “Gather candidates” button. If you have configured everything correctly, you should see “Done” as the final result.
