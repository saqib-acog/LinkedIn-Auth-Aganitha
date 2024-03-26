# Run Application on localhost

```bash
	git clone git@github.com:saqib-acog/LinkedIn-Auth-Aganitha.git
	cd LinkedIn-Auth-Aganitha
```

```javascript
	npm i
	npm run dev
```

# Docker

```bash
	cd LinkedIn-Auth-Aganitha
```

```
	docker build -t linkedauth-v2 .
	docker run -d --restart=always --name linkedinauth --label security=none -v $PWD/customer-data.json:/linkedin-auth/customer-data.json linkedinauth-v2
```

# Docker Compose

```
	docker compose up

```
