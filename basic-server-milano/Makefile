# Local varaibles 
#================
#

pg_name?=postgres
pg_db?=postgres
pg_user?=postgres


start: 
	@echo "Running services"
	@docker-compose up -d

stop:
	@echo "Stopping services"
	@docker-compose down

restart: stop start

logs: 
	@echo ""
	@echo "Attaching to log stream..."
	@docker-compose logs -f

logs-web: 
	@echo ""
	@echo "Attaching to log stream..."
	@docker-compose logs -f web-app-fastiy
	
psql: 
	@echo "Connecting to the database (type "quit to exit") ..."
	@docker exec -it $(pg_name) psql -U $(pg_user)