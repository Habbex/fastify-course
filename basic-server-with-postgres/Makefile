# Local Variables
# ===============
#
pg_name?=postgres
pg_db?=postgres
pg_user?=postgres
count?=1

start:
	@echo "Running services"
	@docker-compose up 

stop:
	@echo "stopping services"
	@docker-compose down

logs:
	@echo ""
	@echo "Attaching to the log's stream...."
	@docker-compose logs -f

psql:
	@echo "Connecting to the database ("quit" to exit) ..."
	@docker exec -it $(pg_name) psql -U $(pg_user)


