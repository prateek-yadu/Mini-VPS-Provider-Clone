LXD restricts us for using the API directly, to enable API call from backend we need to pass the certificate along with the api call for that, we need to create a certificate then convert it into pem file then optionally we can setup a nginx server to get rid of manually adding the pem file again and agin in API call. Below is the setup for it and to create the .pfx file go through the following link https://documentation.ubuntu.com/lxd/latest/howto/access_ui/


# Setup Nginx


#### ***Note*** - You need to genrate the .pem file for the nginx as you wont get the .pem file you will get .pfx file to extract it run the following command

``` bash
openssl pkcs12 -in [your_lxd_pfx_file.pfx] -nocerts -nodes -out key.pem
```

then paste it in the /etc/nginx folder

and also move the crt file in the nginx folder. It will be genrated by lxd UI don't worry

**source**:- https://stackoverflow.com/questions/16397858/how-to-extract-private-key-from-pfx-file-using-openssl 

[first comment and first command] 