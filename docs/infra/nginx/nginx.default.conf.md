
### Replace the file name to default and put it inside /etc/nginx/sites-enabled/

``` nginx
root@server-02:~# cat /etc/nginx/sites-enabled/default 
server {
	listen 80;
	listen [::]:80;

	server_name _;

	location / {
		proxy_ssl_certificate        /etc/nginx/lxd-ui-localhost.crt;
		proxy_ssl_certificate_key    /root/key.pem;
		proxy_pass https://192.168.29.102:8443;
	}
}
```